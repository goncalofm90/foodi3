import Image from "next/image";
import Link from "next/link";
import { CardItem } from "@/types/CardItem";
import { useState, useEffect } from "react";
import { account } from "@/lib/client";

interface RecipeCardProps {
  item: CardItem;
}

export default function RecipeCard({ item }: RecipeCardProps) {
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await account.get();
        setCurrentUser(user);
      } catch {
        setCurrentUser(null);
      }
    };
    fetchUser();
  }, []);

  const handleSaveFavourite = async () => {
    if (!currentUser) {
      alert("Please login to save favourites!");
      return;
    }

    try {
      await fetch("/api/favourites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser.$id,
          itemId: item.id,
          name: item.name,
          type: item.subcategory ? "dish" : "cocktail",
          thumbnail: item.thumbnail,
        }),
      });
      alert("Saved to favourites!");
    } catch {
      alert("Failed to save favourite.");
    }
  };

  return (
    <div className="border rounded shadow p-4 hover:shadow-lg transition flex flex-col">
      <Link href={item.href} className="block">
        {item.thumbnail && (
          <Image
            src={item.thumbnail}
            alt={item.name}
            width={400}
            height={400}
            className="w-full h-48 object-cover rounded"
          />
        )}
        <h2 className="mt-2 text-lg font-semibold">{item.name}</h2>
        {item.category && (
          <p className="text-sm text-gray-500">{item.category}</p>
        )}
      </Link>

      {/* Save button outside the Link */}
      <button
        className="bg-yellow-400 text-white px-2 py-1 rounded mt-2 self-start"
        onClick={handleSaveFavourite}
      >
        Save
      </button>
    </div>
  );
}
