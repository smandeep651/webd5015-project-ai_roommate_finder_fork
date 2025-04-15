"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function MatchedRefresh() {
  const router = useRouter();

  useEffect(() => {
    const needsRefresh = sessionStorage.getItem("refresh-matched");
    if (needsRefresh === "true") {
      sessionStorage.removeItem("refresh-matched");
      router.refresh(); // this re-runs SSR
    }
  }, []);

  return null;
}
