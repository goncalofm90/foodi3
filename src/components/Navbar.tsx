"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { account } from "@/lib/client";

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  // Check if user is logged in
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
      router.push("/auth");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <Link href="/" className="text-xl font-bold">
        Foodi3
      </Link>

      <div className="flex items-center gap-4">
        <Link href="/dishes" className="hover:underline">
          Dishes
        </Link>
        <Link href="/cocktails" className="hover:underline">
          Cocktails
        </Link>

        {user ? (
          <button
            onClick={handleLogout}
            className="bg-red-500 px-4 py-2 rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
        ) : (
          <Link
            href="/auth"
            className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
