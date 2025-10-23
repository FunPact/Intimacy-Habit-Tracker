import React from "react";
import { useFlowWallet } from "../hooks/useFlowWallet";

function shortAddr(addr) {
  if (!addr) return "";
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export default function FlowWalletConnect() {
  const { addr, isLoggingIn, logIn, logOut } = useFlowWallet();

  return (
    <div className="flow-wallet-connect" style={{ display: "flex", gap: 12, alignItems: "center" }}>
      {addr ? (
        <>
          <span>Connected: {shortAddr(addr)}</span>
          <button onClick={logOut} className="px-3 py-2 rounded bg-gray-200 hover:bg-gray-300">Disconnect</button>
        </>
      ) : (
        <button disabled={isLoggingIn} onClick={logIn} className="px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">
          {isLoggingIn ? "Connecting..." : "Connect Flow Wallet"}
        </button>
      )}
    </div>
  );
}
