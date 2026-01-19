"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { account } from "@/lib/client";
import { OAuthProvider, ID } from "appwrite";

export default function AuthPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Check if user is already logged in
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await account.get();
        setUser(currentUser);
      } catch {
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  // Google OAuth login (login only, no signup)
  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      await account.createOAuth2Session({
        provider: OAuthProvider.Google,
        success: `${window.location.origin}/dishes`,
        failure: `${window.location.origin}/auth`,
      });
    } catch (err) {
      console.error("OAuth error:", err);
      setError("Failed to initiate Google login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Email/password registration
  const handleRegister = async () => {
    if (!email || !password) {
      setError("Email and password are required for registration.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await account.create({
        userId: ID.unique(),
        email,
        password,
        name: email, // Use email as name
      });
      alert("Account created! You can now login.");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  // Email/password login
  const handleLogin = async () => {
    if (!email || !password) {
      setError("Email and password are required.");
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
      router.push("/dishes");
    } catch (err: any) {
      console.error(err);
      // Provide user-friendly error messages
      if (err.code === 401) {
        setError("Invalid email or password. Please check your credentials.");
      } else {
        setError(err.message || "Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  // Login / Signup form
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 space-y-6">
      <h1 className="text-3xl font-bold text-center">Foodi3 Login / Signup</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Email / Password */}
      <div className="flex flex-col space-y-2 w-full max-w-sm">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded w-full"
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

      <div className="my-4 w-full max-w-sm text-center">OR</div>

      {/* Google login */}
      <button
        onClick={handleGoogleLogin}
        disabled={loading}
        className="w-full max-w-sm bg-red-500 text-white px-6 py-3 rounded hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Connecting..." : "Sign in with Google"}
      </button>
    </main>
  );
}
