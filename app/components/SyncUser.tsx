"use client";
import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";

export default function SyncUser() {
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (!isLoaded || !user) return;

    fetch("/api/auth/sync", {
      method: "POST",
    });

  }, [isLoaded, user]);

  return null;
}
