"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { account } from "@/lib/client";
import { OAuthProvider, ID } from "appwrite";
import { useToast } from "@/contexts/ToastContext";
import CocktailLoader from "@/components/Loader";
import { User } from "@/types/User";

export default function AuthPage() {
  const router = useRouter();
  const { showSuccess, showError } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLogin, setIsLogin] = useState(true);

  // Check if user is already logged in
  useEffect(() => {
    const fetchAndSyncUser = async () => {
      try {
        const currentUser: User = await account.get();
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
      setPassword("");
      setIsLogin(true);
    } catch {
      const errorMessage = "Registration failed";
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

      const currentUser: User = await account.get();
      setUser(currentUser);
      showSuccess(`Welcome back, ${currentUser.name || currentUser.email}!`);

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
      <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary-900 via-neutral-900 to-accent-900">
        <CocktailLoader />
      </main>
    );
  }

  // If user is logged in, show welcome + logout
  if (user) {
    return (
      <main className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source
              src="https://cdn.pixabay.com/vimeo/723218646/pizza-141053.mp4"
              type="video/mp4"
            />
          </video>
          <div className="absolute inset-0 bg-gradient-to-br from-neutral-900/90 via-neutral-900/85 to-primary-900/90"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center space-y-8 p-8 animate-fade-in">
          <div className="space-y-4">
            <h1 className="text-display-md font-display text-primary-100">
              Welcome back,
            </h1>
            <p className="text-heading-lg font-accent text-primary-200">
              {user.name || user.email}
            </p>
          </div>

          <p className="text-lg text-neutral-300 max-w-md mx-auto">
            Ready to explore delicious recipes and craft cocktails?
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <button
              onClick={() => router.push("/dishes")}
              className="group relative bg-primary-500 text-white px-8 py-4 rounded-button hover:bg-primary-600 transition-all duration-300 shadow-lifted hover:shadow-xl hover:scale-105 font-semibold text-lg"
            >
              <span className="relative z-10">Browse Recipes</span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-accent-500 rounded-button opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
            <button
              onClick={handleLogout}
              className="bg-neutral-800/80 backdrop-blur-sm text-neutral-200 px-8 py-4 rounded-button hover:bg-neutral-700 transition-all duration-300 border border-neutral-600 hover:border-neutral-500 font-semibold text-lg"
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
    <main className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="test.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-900/90 via-neutral-900/85 to-primary-900/90"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md px-6 animate-scale-in">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <h1 className="text-display-md font-display text-primary-100 mb-2">
            Foodi3
          </h1>
          <p className="text-neutral-300 font-accent text-lg">
            Recipes & Cocktails, always at your fingertips
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-white/95 backdrop-blur-md rounded-card shadow-lifted p-8 space-y-6">
          {/* Tab Switcher */}
          <div className="flex bg-neutral-100 rounded-button p-1">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2.5 rounded-button font-semibold transition-all duration-300 ${
                isLogin
                  ? "bg-primary-500 text-white shadow-soft"
                  : "text-neutral-600 hover:text-neutral-800"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2.5 rounded-button font-semibold transition-all duration-300 ${
                !isLogin
                  ? "bg-primary-500 text-white shadow-soft"
                  : "text-neutral-600 hover:text-neutral-800"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-button text-sm animate-slide-up">
              {error}
            </div>
          )}

          {loading ? (
            <div className="py-8">
              <CocktailLoader />
            </div>
          ) : (
            <>
              {/* Email/Password Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError(null);
                    }}
                    className="w-full border border-neutral-300 p-3 rounded-button focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder={
                      isLogin ? "Enter password" : "Min. 8 characters"
                    }
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError(null);
                    }}
                    className="w-full border border-neutral-300 p-3 rounded-button focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    disabled={loading}
                  />
                </div>

                <button
                  onClick={isLogin ? handleLogin : handleRegister}
                  disabled={loading}
                  className="w-full bg-primary-500 text-white py-3.5 rounded-button hover:bg-primary-600 transition-all duration-300 font-semibold shadow-medium hover:shadow-lifted disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                >
                  {isLogin ? "Login" : "Create Account"}
                </button>
              </div>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-neutral-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-neutral-500 font-medium">
                    Or continue with
                  </span>
                </div>
              </div>

              {/* Google Sign In */}
              <button
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full bg-white border-2 border-neutral-300 text-neutral-700 py-3.5 rounded-button hover:bg-neutral-50 hover:border-neutral-400 transition-all duration-300 font-semibold shadow-soft hover:shadow-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Sign in with Google
              </button>
            </>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-neutral-400 text-sm mt-6">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-primary-300 hover:text-primary-200 font-semibold underline"
          >
            {isLogin ? "Sign up" : "Login"}
          </button>
        </p>
      </div>
    </main>
  );
}
