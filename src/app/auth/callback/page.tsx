"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { account } from "@/lib/client";

export default function OAuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        const currentUser = await account.get();

        const syncResponse = await fetch("/api/register-user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: currentUser.$id,
            email: currentUser.email,
            name: currentUser.name || currentUser.email,
            avatar:
              currentUser.prefs?.avatar || currentUser.prefs?.picture || "",
            oauthProvider: "google",
          }),
        });

        const responseData = await syncResponse.json();

        // Even if user already exists, it's still a successful login
        if (syncResponse.ok || responseData.message === "User already exists") {
          router.push("/dishes");
        } else {
          console.error("❌ Sync failed:", responseData.error);
          router.push("/auth?error=sync_failed");
        }
      } catch (error) {
        console.error("❌ OAuth callback error:", error);
        router.push("/auth?error=callback_failed");
      }
    };

    handleOAuthCallback();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Completing login...</h1>
        <p>Please wait while we set up your account.</p>
      </div>
    </div>
  );
}
