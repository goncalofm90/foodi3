"use client";

import { ReactNode, useEffect, useState } from "react";
import { account } from "@/lib/client";
import { useRouter } from "next/navigation";
import CocktailLoader from "./Loader";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await account.get(); // throws if not logged in
        setAuthenticated(true);
      } catch {
        router.replace("/auth");
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [router]);

  if (loading) return <CocktailLoader />;
  if (!authenticated) return null;

  return <>{children}</>;
}
