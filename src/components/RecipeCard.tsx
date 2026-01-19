"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { account, client } from "@/lib/client";
import { CardItem } from "@/types/CardItem";
import { TablesDB, ID, Query } from "appwrite";

interface RecipeCardProps {
  item: CardItem;
}

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DB_ID!;
const FAVOURITES_TABLE_ID =
  process.env.NEXT_PUBLIC_APPWRITE_FAVOURITES_TABLE_ID!;
const tables = new TablesDB(client);

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
      // Use Query class for proper syntax
      const existing = await tables.listRows({
        databaseId: DATABASE_ID,
        tableId: FAVOURITES_TABLE_ID,
        queries: [
          Query.equal("userId", currentUser.$id),
          Query.equal("itemId", item.id),
        ],
      });

      // If we found any rows, user already has this item
      if (existing.rows && existing.rows.length > 0) {
        alert("You already have this in your favourites!");
        return;
      }

      // Save the favourite
      const uniqueRowId = ID.unique();

      await tables.createRow({
        databaseId: DATABASE_ID,
        tableId: FAVOURITES_TABLE_ID,
        rowId: uniqueRowId,
        data: {
          userId: currentUser.$id,
          itemId: item.id,
          itemName: item.name,
          itemType: item.subcategory ? "dish" : "cocktail",
          thumbnail: item.thumbnail,
        },
        read: [`user:${currentUser.$id}`],
        write: [`user:${currentUser.$id}`],
      });

      alert("Saved to favourites!");
    } catch (err: any) {
      console.error("❌ Failed to save favourite:", err);
      alert(err.message || "Failed to save favourite.");
    }
  };

  return (
    <div className="border rounded shadow p-4 hover:shadow-lg transition flex flex-col">
      <Image
        src={item.thumbnail || ""}
        alt={item.name}
        width={400}
        height={400}
        className="w-full h-48 object-cover rounded"
      />
      <h2 className="mt-2 text-lg font-semibold">{item.name}</h2>
      {item.category && (
        <p className="text-sm text-gray-500">{item.category}</p>
      )}

      <button
        className="bg-yellow-400 text-white px-2 py-1 rounded mt-2 self-start"
        onClick={handleSaveFavourite}
      >
        Save
      </button>
    </div>
  );
}
