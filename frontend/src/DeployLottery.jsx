// DeployLottery.jsx
import { useState } from 'react';
import { ethers } from 'ethers';
import LotteryABI from './LotteryABI.json';
import LotteryBytecode from './LotteryBytecode.json';

function DeployLottery({ setContractAddress }) {
  const [deploying, setDeploying] = useState(false);
  const [txHash, setTxHash] = useState(null);

  async function deployContract() {
    if (!window.ethereum) return alert("Install MetaMask");

    setDeploying(true);

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    const factory = new ethers.ContractFactory(LotteryABI, LotteryBytecode.bytecode, signer);
    const contract = await factory.deploy();
    await contract.waitForDeployment();

    const address = await contract.getAddress();
    const tx = contract.deploymentTransaction();
    setTxHash(tx?.hash);
    setContractAddress(address);
    setDeploying(false);
  }

  return (
    <div>
      <h2>🎲 Deploy Lottery</h2>
      <button onClick={deployContract} disabled={deploying}>
        {deploying ? "Deploying..." : "Deploy New Lottery"}
      </button>
      {txHash && <p>📦 Tx Hash: <a href={`https://sepolia.etherscan.io/tx/${txHash}`} target="_blank">{txHash}</a></p>}
    </div>
  );
}

export default DeployLottery;
