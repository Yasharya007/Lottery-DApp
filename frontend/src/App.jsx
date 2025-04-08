// App.jsx
import { useState } from 'react';
import DeployLottery from './DeployLottery';

function App() {
  const [contractAddress, setContractAddress] = useState("");

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>🎰 Lottery DApp</h1>
      <DeployLottery setContractAddress={setContractAddress} />
      {contractAddress && (
        <div style={{ marginTop: "1rem" }}>
          <p>✅ Contract Deployed at:</p>
          <strong>{contractAddress}</strong>
        </div>
      )}
    </div>
  );
}

export default App;
