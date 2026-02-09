// src/app/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { account } from "@/lib/client";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const check = async () => {
      try {
        await account.get();
        router.replace("/dishes");
      } catch {
        router.replace("/auth");
      }
    };

    check();
  }, [router]);

  return <div className="p-6 text-center">Loading...</div>;
}
