"use client";

import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="cursor-pointer mb-4 px-3 py-1 bg-gray-800 rounded hover:bg-gray-500"
    >
      &larr; Back
    </button>
  );
}
