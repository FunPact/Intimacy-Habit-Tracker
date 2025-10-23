import React, { useCallback } from "react";
import FlowWalletConnect from "../components/FlowWalletConnect";
import StreakMeter from "../components/StreakMeter";
import { useHabitStreaks } from "../hooks/useHabitStreaks";
import { useFlowWallet } from "../hooks/useFlowWallet";

export default function DashboardPage() {
  const { currentStreak, nextMilestone, isMilestone, incrementStreak, resetStreak, isMinting, mintStatus, mintReward } = useHabitStreaks();
  const { addr, isAuthenticated } = useFlowWallet();

  const onMint = useCallback(async () => {
    if (!isAuthenticated) return alert("Connect Flow wallet first.");
    if (!isMilestone(currentStreak)) return alert("Reach a milestone to mint a reward.");
    try {
      const res = await mintReward(addr, 1);
      alert(`Mint submitted. Tx: ${res.txId}`);
    } catch (e) {
      alert(`Mint failed: ${e.message}`);
    }
  }, [isAuthenticated, isMilestone, currentStreak, mintReward, addr]);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <FlowWalletConnect />
      <div className="space-y-3">
        <StreakMeter value={currentStreak} target={nextMilestone} />
        <div className="flex gap-2">
          <button className="px-3 py-2 rounded bg-gray-200 hover:bg-gray-300" onClick={incrementStreak}>Complete Habit Today</button>
          <button className="px-3 py-2 rounded bg-gray-200 hover:bg-gray-300" onClick={resetStreak}>Reset</button>
          <button className="px-3 py-2 rounded bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50" disabled={!isAuthenticated || !isMilestone(currentStreak) || isMinting} onClick={onMint}>
            {isMinting ? "Minting..." : "Mint Confidence Token"}
          </button>
        </div>
        {mintStatus && (
          mintStatus.ok ? (
            <div className="text-green-700">Mint submitted. Tx: {mintStatus.txId}</div>
          ) : (
            <div className="text-red-700">Mint failed: {mintStatus.error}</div>
          )
        )}
      </div>
    </div>
  );
}
