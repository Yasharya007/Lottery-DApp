// App.jsx
import { useState } from 'react';
import DeployLottery from './DeployLottery';
import JoinLottery from './JoinLottery';

function App() {
  const [contractAddress, setContractAddress] = useState("");

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>🎰 Lottery DApp</h1>

      <div style={{
        display: "flex",
        gap: "2rem",
        alignItems: "flex-start",
        flexWrap: "wrap",
        marginTop: "2rem"
      }}>
        <div style={{ flex: 1 }}>
          <DeployLottery setContractAddress={setContractAddress} />
          {contractAddress && (
            <div style={{ marginTop: "1rem" }}>
              <p>✅ Contract Deployed at:</p>
              <strong>{contractAddress}</strong>
            </div>
          )}
        </div>

        <div style={{ flex: 1 }}>
          <JoinLottery />
        </div>
      </div>
    </div>
  );
}

export default App;
