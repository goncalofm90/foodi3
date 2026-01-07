// src/components/Navbar.tsx
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between">
      <Link href="/" className="hover:underline">
        <h1 className="text-xl font-bold">Foodi3</h1>
      </Link>
      <div className="space-x-4">
        <Link href="/dishes" className="hover:underline">
          Dishes
        </Link>
        <Link href="/cocktails" className="hover:underline">
          Cocktails
        </Link>
      </div>
    </nav>
  );
}
