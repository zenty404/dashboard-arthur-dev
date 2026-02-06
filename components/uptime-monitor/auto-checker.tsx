"use client";

import { useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { checkAllSites } from "@/app/tools/uptime-monitor/actions";

const CHECK_INTERVAL = 60_000; // 60 seconds

export function AutoChecker() {
  const router = useRouter();
  const checking = useRef(false);

  const runCheck = useCallback(async () => {
    if (checking.current) return;
    checking.current = true;
    try {
      await checkAllSites();
      router.refresh();
    } finally {
      checking.current = false;
    }
  }, [router]);

  useEffect(() => {
    // Check on mount
    runCheck();

    // Then check every 60s
    const interval = setInterval(runCheck, CHECK_INTERVAL);
    return () => clearInterval(interval);
  }, [runCheck]);

  return null;
}
