import { useEffect, useState, useCallback } from "react";
import * as fcl from "@onflow/fcl";
import "../flow/fclConfig";

export function useFlowWallet() {
  const [user, setUser] = useState({ addr: null, loggedIn: null });
  const [addr, setAddr] = useState(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    const unsub = fcl.currentUser.subscribe((u) => {
      setUser(u);
      setAddr(u?.addr ?? null);
    });
    return () => unsub();
  }, []);

  const logIn = useCallback(async () => {
    setIsLoggingIn(true);
    try {
      await fcl.logIn();
    } finally {
      setIsLoggingIn(false);
    }
  }, []);

  const logOut = useCallback(async () => {
    await fcl.unauthenticate();
  }, []);

  const ensureSetup = useCallback(async () => {
    // Optional: send setup transaction to create user's vault if not set up
    // This is a placeholder; you may call an API route to perform setup.
    return true;
  }, []);

  return {
    user,
    addr,
    isLoggingIn,
    logIn,
    logOut,
    ensureSetup,
    isAuthenticated: !!addr,
  };
}
