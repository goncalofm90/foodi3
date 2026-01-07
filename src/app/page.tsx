// src/app/page.tsx
import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="p-6">
        <h1 className="text-4xl font-bold mb-6">Welcome to Foodi3</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Link href="/dishes" className="border p-4 rounded shadow hover:shadow-lg transition">
            <h2 className="text-2xl font-semibold mb-2">Dishes</h2>
            <p>Explore meals from around the world.</p>
          </Link>

          <Link href="/cocktails" className="border p-4 rounded shadow hover:shadow-lg transition">
            <h2 className="text-2xl font-semibold mb-2">Cocktails</h2>
            <p>Discover and enjoy cocktails.</p>
          </Link>
        </div>
      </main>
    </>
  );
}
