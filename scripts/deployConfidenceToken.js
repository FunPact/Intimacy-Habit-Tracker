/*
  Deployment helper (Testnet):
  - Requires an account on Flow Testnet with deployed contract permissions
  - Provide env vars:
    FLOW_ACCOUNT_ADDRESS (without 0x), FLOW_PRIVATE_KEY, FLOW_KEY_ID (integer),
    FLOW_ACCESS_NODE (default https://rest-testnet.onflow.org), FLOW_NETWORK (testnet),
    FLOW_HASH_ALGO (SHA3_256), FLOW_SIGN_ALGO (ECDSA_P256 or ECDSA_secp256k1)

  This script prints step-by-step guidance if env vars are missing.
  For production, prefer using Flow CLI or Flow Port to deploy the contract.
*/

/* eslint-disable no-console */
const fs = require("fs");

function printGuide() {
  console.log("\nConfidenceToken deployment guide (Testnet):\n");
  console.log("1) Install Flow CLI: https://docs.onflow.org/flow-cli/install/");
  console.log("2) Create/Testnet account or use Flow Port: https://port.onflow.org/testnet ");
  console.log("3) Set .env with FLOW_ACCOUNT_ADDRESS, FLOW_PRIVATE_KEY, FLOW_KEY_ID");
  console.log("4) Replace 0xCONF_ADDR placeholders with your deployed address in transactions.");
  console.log("5) Deploy Cadence contract to your account (Flow Port UI or flow CLI).\n");
}

function ensureContract() {
  const path = "./cadence/ConfidenceToken.cdc";
  if (!fs.existsSync(path)) {
    console.error("Contract file not found at", path);
    process.exit(1);
  }
  const code = fs.readFileSync(path, "utf8");
  console.log("Loaded ConfidenceToken.cdc (", code.length, "bytes )");
}

function main() {
  const addr = process.env.FLOW_ACCOUNT_ADDRESS;
  const pkey = process.env.FLOW_PRIVATE_KEY;
  const keyId = process.env.FLOW_KEY_ID;

  ensureContract();

  if (!addr || !pkey || !keyId) {
    console.warn("Missing env vars for automated deployment.");
    printGuide();
    process.exit(0);
  }

  console.log("Automated deployment via script is not configured in this template.");
  console.log("Use Flow Port or Flow CLI to deploy the contract to:", addr);
}

if (require.main === module) {
  main();
}
