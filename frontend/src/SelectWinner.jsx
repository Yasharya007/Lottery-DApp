// SelectWinner.jsx
import { useState } from 'react';
import { ethers } from 'ethers';
import LotteryABI from './LotteryABI.json';

function SelectWinner() {
  const [contractAddress, setContractAddress] = useState('');
  const [txHash, setTxHash] = useState('');
  const [error, setError] = useState('');

  async function handleSelectWinner() {
    try {
      setTxHash('');
      setError('');

      if (!window.ethereum) throw new Error("Please install MetaMask");

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const lotteryContract = new ethers.Contract(contractAddress, LotteryABI, signer);

      const tx = await lotteryContract.selectWinner();
      await tx.wait();

      setTxHash(tx.hash);
    } catch (err) {
      console.error(err);
      setError(err.reason || err.message);
    }
  }

  return (
    <div style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: "8px" }}>
      <h3>🎯 Select Lottery Winner</h3>
      <input
        type="text"
        placeholder="Enter Lottery Contract Address"
        value={contractAddress}
        onChange={(e) => setContractAddress(e.target.value)}
        style={{ width: "100%", marginBottom: "1rem", padding: "0.5rem" }}
      />
      <button onClick={handleSelectWinner}>Select Winner</button>
      {txHash && (
        <p>✅ Winner selected! Tx Hash: <a href={`https://sepolia.etherscan.io/tx/${txHash}`} target="_blank" rel="noreferrer">{txHash}</a></p>
      )}
      {error && <p style={{ color: "red" }}>❌ {error}</p>}
    </div>
  );
}

export default SelectWinner;
