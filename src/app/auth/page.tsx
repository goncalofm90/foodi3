"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { account } from "@/lib/client";
import { OAuthProvider, ID } from "appwrite";
import { useToast } from "@/contexts/ToastContext";
import CocktailLoader from "@/components/Loader";

export default function AuthPage() {
  const router = useRouter();
  const { showSuccess, showError } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Check if user is already logged in
  useEffect(() => {
    const fetchAndSyncUser = async () => {
      try {
        const currentUser = await account.get();
        setUser(currentUser);

        // Always try to sync user to database
        const response = await fetch("/api/register-user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: currentUser.$id,
            email: currentUser.email,
            name: currentUser.name || currentUser.email,
            avatar: currentUser.prefs?.avatar || "",
          }),
        });

        if (!response.ok) {
          console.warn("User sync warning:", await response.text());
        }
      } catch {
        setUser(null);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchAndSyncUser();
  }, []);

  // Google OAuth login
  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      await account.createOAuth2Session({
        provider: OAuthProvider.Google,
        success: `${window.location.origin}/auth/callback`,
        failure: `${window.location.origin}/auth?error=oauth_failed`,
      });
    } catch (err) {
      console.error("OAuth error:", err);
      const errorMessage = "Failed to initiate Google login. Please try again.";
      setError(errorMessage);
      showError(errorMessage);
      setLoading(false);
    }
  };

  // Email/password registration
  const handleRegister = async () => {
    if (!email || !password) {
      const errorMessage = "Email and password are required for registration.";
      setError(errorMessage);
      showError(errorMessage);
      return;
    }

    if (password.length < 8) {
      const errorMessage = "Password must be at least 8 characters long.";
      setError(errorMessage);
      showError(errorMessage);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1️⃣ Create Appwrite account
      const userAccount = await account.create({
        userId: ID.unique(),
        email,
        password,
        name: email,
      });

      // 2️⃣ Create user row via server-side API route
      const res = await fetch("/api/register-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userAccount.$id,
          email: userAccount.email,
          name: userAccount.name || userAccount.email,
          avatar: userAccount.prefs?.avatar || "",
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to create user in database");
      }

      showSuccess("Account created successfully! You can now login.");
      // Clear the password field for security
      setPassword("");
    } catch (err: any) {
      console.error(err);
      const errorMessage = err.message || "Registration failed";
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Email/password login
  const handleLogin = async () => {
    if (!email || !password) {
      const errorMessage = "Email and password are required.";
      setError(errorMessage);
      showError(errorMessage);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await account.createEmailPasswordSession({
        email,
        password,
      });

      const currentUser = await account.get();
      setUser(currentUser);
      showSuccess(`Welcome back, ${currentUser.name || currentUser.email}!`);

      // Small delay to show the success message before navigating
      setTimeout(() => {
        router.push("/dishes");
      }, 500);
    } catch (err: any) {
      console.error(err);
      let errorMessage = "Login failed";

      if (err.code === 401) {
        errorMessage =
          "Invalid email or password. Please check your credentials.";
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const handleLogout = async () => {
    try {
      await account.deleteSession({ sessionId: "current" });
      setUser(null);
      showSuccess("Logged out successfully");
      router.push("/auth");
    } catch (err) {
      console.error(err);
      showError("Failed to logout");
    }
  };

  // Show loader while checking auth status
  if (initialLoading) {
    return (
      <main className="flex items-center justify-center min-h-screen">
        <CocktailLoader />
      </main>
    );
  }

  // If user is logged in, show welcome + logout
  if (user) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-center space-y-6">
          <h1 className="text-3xl font-bold mb-4">
            Welcome, {user.name || user.email}
          </h1>
          <p className="text-neutral-600 mb-6">You're already logged in!</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => router.push("/dishes")}
              className="bg-primary-500 text-white px-6 py-3 rounded-button hover:bg-primary-600 transition"
            >
              Browse Recipes
            </button>
            <button
              onClick={handleLogout}
              className="bg-gray-700 text-white px-6 py-3 rounded-button hover:bg-gray-800 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </main>
    );
  }

  // Login / Signup form
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 space-y-6">
      <h1 className="text-3xl font-bold text-center">Foodi3 Login / Signup</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded w-full max-w-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="w-full max-w-sm py-8">
          <CocktailLoader />
        </div>
      ) : (
        <>
          <div className="flex flex-col space-y-2 w-full max-w-sm">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError(null);
              }}
              className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-primary-500"
              disabled={loading}
            />
            <input
              type="password"
              placeholder="Password (min. 8 characters)"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(null);
              }}
              className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-primary-500"
              disabled={loading}
            />

            <div className="flex justify-between space-x-2">
              <button
                onClick={handleRegister}
                disabled={loading}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition w-1/2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Register
              </button>
              <button
                onClick={handleLogin}
                disabled={loading}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition w-1/2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Login
              </button>
            </div>
          </div>

          <div className="my-4 w-full max-w-sm text-center text-neutral-500">
            OR
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full max-w-sm bg-red-500 text-white px-6 py-3 rounded hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            {loading ? "Connecting..." : "Sign in with Google"}
          </button>
        </>
      )}
    </main>
  );
}
