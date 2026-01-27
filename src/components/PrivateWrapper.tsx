// src/components/PrivateWrapper.tsx
"use client";

import { useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { account } from "@/lib/client";

interface PrivateWrapperProps {
  children: ReactNode;
  redirectTo?: string; // optional, defaults to /login
}

export default function PrivateWrapper({
  children,
  redirectTo = "/auth",
}: PrivateWrapperProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const u = await account.get();
        setUser(u);
      } catch {
        router.replace(redirectTo); // redirect if not logged in
      } finally {
        setLoading(false);
      }
    };
    checkUser();
  }, [router, redirectTo]);

  if (loading)
    return <p className="p-6 text-center">Checking authentication...</p>;
  if (!user) return null;

  return <>{children}</>;
}
