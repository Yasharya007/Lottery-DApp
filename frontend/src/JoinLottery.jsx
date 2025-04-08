// JoinLottery.jsx
import { useState } from 'react';
import { ethers } from 'ethers';

function JoinLottery() {
  const [contractAddress, setContractAddress] = useState("");
  const [txHash, setTxHash] = useState(null);
  const [joining, setJoining] = useState(false);

  async function joinLottery() {
    if (!window.ethereum) return alert("Install MetaMask first");

    try {
      setJoining(true);
      setTxHash(null);

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const tx = await signer.sendTransaction({
        to: contractAddress,
        value: ethers.parseEther("0.001"),
      });

      await tx.wait();
      setTxHash(tx.hash);
    } catch (error) {
      alert("Transaction failed: " + error.message);
    } finally {
      setJoining(false);
    }
  }

  return (
    <div style={{ marginTop: "2rem" }}>
      <h2>🙋 Join Lottery</h2>
      <input
        type="text"
        placeholder="Enter Contract Address"
        value={contractAddress}
        onChange={(e) => setContractAddress(e.target.value)}
        style={{ width: "300px", marginRight: "10px" }}
      />
      <button onClick={joinLottery} disabled={joining || !contractAddress}>
        {joining ? "Joining..." : "Join for 0.001 ETH"}
      </button>

      {txHash && (
        <p>
          ✅ Joined! Tx Hash:{" "}
          <a href={`https://sepolia.etherscan.io/tx/${txHash}`} target="_blank">
            {txHash}
          </a>
        </p>
      )}
    </div>
  );
}

export default JoinLottery;
