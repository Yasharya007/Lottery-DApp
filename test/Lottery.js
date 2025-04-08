const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Lottery Contract", function () {
  let Lottery, lottery, manager, participant1, participant2, participant3;

  beforeEach(async function () {
    [manager, participant1, participant2, participant3] = await ethers.getSigners();
    Lottery = await ethers.getContractFactory("Lottery");
    lottery = await Lottery.connect(manager).deploy();
    await lottery.waitForDeployment();
  });

  it("should set manager correctly", async function () {
    expect(await lottery.manager()).to.equal(manager.address);
  });

  it("should allow participants to enter by sending ether", async function () {
    await participant1.sendTransaction({
      to: await lottery.getAddress(),
      value: ethers.parseEther("0.001"),
    });

    const participants = await lottery.participants(0);
    expect(participants).to.equal(participant1.address);
  });

  it("should return correct balance", async function () {
    await participant1.sendTransaction({
      to: await lottery.getAddress(),
      value: ethers.parseEther("0.001"),
    });

    const balance = await lottery.getBalance();
    expect(balance).to.equal(ethers.parseEther("0.001"));
  });

  it("should only allow manager to call selectWinner", async function () {
    await participant1.sendTransaction({ to: await lottery.getAddress(), value: ethers.parseEther("0.001") });
    await participant2.sendTransaction({ to: await lottery.getAddress(), value: ethers.parseEther("0.001") });
    await participant3.sendTransaction({ to: await lottery.getAddress(), value: ethers.parseEther("0.001") });
  
    await expect(lottery.connect(participant1).selectWinner())
      .to.be.revertedWith("Only manager can call this");
  });
  
  it("should require at least 3 participants to select a winner", async function () {
    await participant1.sendTransaction({ to: await lottery.getAddress(), value: ethers.parseEther("0.001") });
    await participant2.sendTransaction({ to: await lottery.getAddress(), value: ethers.parseEther("0.001") });
  
    await expect(lottery.connect(manager).selectWinner())
      .to.be.revertedWith("At least 3 participants required");
  });

  it("should transfer entire balance to winner", async function () {
    await participant1.sendTransaction({ to: await lottery.getAddress(), value: ethers.parseEther("0.001") });
    await participant2.sendTransaction({ to: await lottery.getAddress(), value: ethers.parseEther("0.001") });
    await participant3.sendTransaction({ to: await lottery.getAddress(), value: ethers.parseEther("0.001") });

    const initialBalances = await Promise.all([
      ethers.provider.getBalance(participant1.address),
      ethers.provider.getBalance(participant2.address),
      ethers.provider.getBalance(participant3.address),
    ]);

    await lottery.connect(manager).selectWinner();

    const newBalances = await Promise.all([
      ethers.provider.getBalance(participant1.address),
      ethers.provider.getBalance(participant2.address),
      ethers.provider.getBalance(participant3.address),
    ]);

    const diff = newBalances.map((bal, i) => bal - initialBalances[i]);
    const winnerReceived = diff.find(val => val > ethers.parseEther("0.002"));

    expect(winnerReceived).to.not.be.undefined;
  });
});
