"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { account } from "@/lib/client";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);

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

  const handleLogout = async () => {
    try {
      await account.deleteSession({ sessionId: "current" });
      setUser(null);
      window.location.href = "/auth";
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <Link href="/" className="text-xl font-bold">
        Foodi3
      </Link>

      <div className="flex items-center space-x-4">
        <Link href="/dishes">Dishes</Link>
        <Link href="/cocktails">Cocktails</Link>

        {user ? (
          <>
            <Link href="/profile">Profile</Link>
            <button
              onClick={handleLogout}
              className="bg-gray-700 px-3 py-1 rounded hover:bg-gray-600 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <Link href="/auth">Login</Link>
        )}
      </div>
    </nav>
  );
}
