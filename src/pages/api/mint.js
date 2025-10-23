// Next.js API route to submit a mint transaction using a custodial key (server-side)
// Requires env vars to be set. If missing, returns 501 with guidance.

import * as fcl from "@onflow/fcl";
import { ec as EC } from "elliptic";
import { sha3_256 } from "js-sha3";

const ACCESS_NODE = process.env.FLOW_ACCESS_NODE || "https://rest-testnet.onflow.org";
const NETWORK = process.env.FLOW_NETWORK || "testnet";
const CONF_ADDR = process.env.CONFIDENCE_TOKEN_ADDRESS; // 0x prefixed
const HASH_ALGO = process.env.FLOW_HASH_ALGO || "SHA3_256"; // SHA3_256
const SIGN_ALGO = process.env.FLOW_SIGN_ALGO || "ECDSA_P256"; // ECDSA_P256 or ECDSA_secp256k1
const SERVICE_ADDRESS = process.env.FLOW_ACCOUNT_ADDRESS; // without 0x
const SERVICE_KEY_ID = Number(process.env.FLOW_KEY_ID || 0);
const SERVICE_PRIVATE_KEY = process.env.FLOW_PRIVATE_KEY; // hex string

fcl.config()
  .put("flow.network", NETWORK)
  .put("accessNode.api", ACCESS_NODE);

function response(res, status, json) { res.status(status).json(json); }

export default async function handler(req, res) {
  if (req.method !== "POST") return response(res, 405, { error: "Method not allowed" });
  if (!CONF_ADDR) return response(res, 501, { error: "Server missing CONFIDENCE_TOKEN_ADDRESS" });
  if (!SERVICE_ADDRESS || !SERVICE_PRIVATE_KEY) {
    return response(res, 501, { error: "Server missing Flow service account credentials. Configure FLOW_ACCOUNT_ADDRESS, FLOW_PRIVATE_KEY, FLOW_KEY_ID." });
  }

  const { recipient, amount } = req.body || {};
  if (!recipient || !amount) return response(res, 400, { error: "recipient and amount are required" });

  const cadence = `
    import ConfidenceToken from ${CONF_ADDR}
    import FungibleToken from 0x9a0766d93b6608b7
    transaction(recipient: Address, amount: UFix64) {
      prepare(signer: AuthAccount) {
        let minter = ConfidenceToken.getMinter()
        let receiverRef = getAccount(recipient)
          .getCapability(ConfidenceToken.TokenReceiverPublicPath)
          .borrow<&{FungibleToken.Receiver}>()
          ?? panic("Recipient has no receiver set up")
        minter.mintTo(recipient: receiverRef, amount: amount)
      }
    }
  `;

  const authorization = (account = {}) => {
    const curve = SIGN_ALGO === "ECDSA_secp256k1" ? "secp256k1" : "p256";
    const ec = new EC(curve);
    const privateKeyHex = SERVICE_PRIVATE_KEY.startsWith("0x")
      ? SERVICE_PRIVATE_KEY.slice(2)
      : SERVICE_PRIVATE_KEY;

    return {
      ...account,
      tempId: `${SERVICE_ADDRESS}-${SERVICE_KEY_ID}`,
      addr: fcl.sansPrefix(SERVICE_ADDRESS),
      keyId: Number(SERVICE_KEY_ID),
      signingFunction: async (signable) => {
        const message = Buffer.from(signable.message, "hex");
        const hash = Buffer.from(sha3_256.arrayBuffer(message));
        const key = ec.keyFromPrivate(privateKeyHex);
        const sig = key.sign(hash, { canonical: true });
        const r = sig.r.toArrayLike(Buffer, "be", 32);
        const s = sig.s.toArrayLike(Buffer, "be", 32);
        const signatureHex = Buffer.concat([r, s]).toString("hex");
        return { addr: fcl.withPrefix(SERVICE_ADDRESS), keyId: Number(SERVICE_KEY_ID), signature: signatureHex };
      },
    };
  };

  try {
    const txId = await fcl.mutate({
      cadence,
      args: (arg, t) => [
        arg(recipient, t.Address),
        arg(`${Number(amount).toFixed(2)}`, t.UFix64),
      ],
      proposer: authorization,
      payer: authorization,
      authorizations: [authorization],
      limit: 9999,
    });
    return response(res, 200, { ok: true, txId });
  } catch (e) {
    return response(res, 500, { error: e.message || String(e) });
  }
}
