import { useCallback, useMemo, useState } from "react";

export function useHabitStreaks() {
  // Simple local state to simulate streaks until wired to real data source.
  const [currentStreak, setCurrentStreak] = useState(0);
  const [isMinting, setIsMinting] = useState(false);
  const [mintStatus, setMintStatus] = useState(null);

  const nextMilestone = useMemo(() => {
    // milestones 3, 7, 14, 30...
    const milestones = [3, 7, 14, 30, 60, 90];
    for (const m of milestones) if (currentStreak < m) return m;
    return milestones[milestones.length - 1];
  }, [currentStreak]);

  const isMilestone = useCallback((streak) => {
    return [3, 7, 14, 30, 60, 90].includes(streak);
  }, []);

  const incrementStreak = useCallback(() => {
    setCurrentStreak((s) => s + 1);
  }, []);

  const resetStreak = useCallback(() => setCurrentStreak(0), []);

  const mintReward = useCallback(async (recipientAddr, amountWhole = 1) => {
    setIsMinting(true);
    setMintStatus(null);
    try {
      const res = await fetch("/api/mint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipient: recipientAddr, amount: amountWhole }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Mint failed");
      setMintStatus({ ok: true, txId: data.txId });
      return data;
    } catch (e) {
      setMintStatus({ ok: false, error: e.message });
      throw e;
    } finally {
      setIsMinting(false);
    }
  }, []);

  return {
    currentStreak,
    nextMilestone,
    isMilestone,
    incrementStreak,
    resetStreak,
    isMinting,
    mintStatus,
    mintReward,
  };
}
