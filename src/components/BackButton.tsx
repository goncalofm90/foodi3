"use client";

import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className={`
                    flex items-center gap-2 px-4 py-2.5 rounded-button font-medium text-sm
                    transition-all duration-200 bg-primary-500 text-white shadow-sm hover:bg-primary-600 hover:shadow-md

                  `}
    >
      &larr; Back
    </button>
  );
}
