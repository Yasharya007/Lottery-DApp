const fs = require("fs");
const path = require("path");

const artifactPath = path.resolve(__dirname, "../artifacts/contracts/Lottery.sol/Lottery.json");
const frontendDir = path.resolve(__dirname, "../frontend/src");

const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));

fs.writeFileSync(
  path.join(frontendDir, "LotteryABI.json"),
  JSON.stringify(artifact.abi, null, 2)
);

fs.writeFileSync(
  path.join(frontendDir, "LotteryBytecode.json"),
  JSON.stringify({ bytecode: artifact.bytecode }, null, 2)
);

console.log("✅ ABI and bytecode copied to frontend/src/");
