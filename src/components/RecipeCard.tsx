"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { client } from "@/lib/client";
import { CardItem } from "@/types/CardItem";
import { TablesDB, ID } from "appwrite";

interface RecipeCardProps {
  item: CardItem;
  currentUser: any;
  isFavourite: boolean;
  favouriteRowId: string | null;
  onFavouriteToggle: (
    itemId: string,
    rowId: string | null,
    isAdding: boolean,
  ) => void;
}

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DB_ID!;
const FAVOURITES_TABLE_ID =
  process.env.NEXT_PUBLIC_APPWRITE_FAVOURITES_TABLE_ID!;
const tables = new TablesDB(client);

export default function RecipeCard({
  item,
  currentUser,
  isFavourite,
  favouriteRowId,
  onFavouriteToggle,
}: RecipeCardProps) {
  const [loading, setLoading] = useState(false);

  const handleSaveFavourite = async () => {
    if (!currentUser) {
      alert("Please login to save favourites!");
      return;
    }

    // Prevent saving if already a favorite will replace alerts with flashes later
    if (isFavourite) {
      alert("Already in your favourites!");
      return;
    }

    setLoading(true);

    try {
      const uniqueRowId = ID.unique();

      await tables.createRow({
        databaseId: DATABASE_ID,
        tableId: FAVOURITES_TABLE_ID,
        rowId: uniqueRowId,
        data: {
          userId: currentUser.$id,
          itemId: item.id,
          itemName: item.name,
          itemType: item.subcategory === "Alcoholic" ? "cocktail" : "dish",
          thumbnail: item.thumbnail,
        },
        read: [`user:${currentUser.$id}`],
        write: [`user:${currentUser.$id}`],
      });

      onFavouriteToggle(item.id, uniqueRowId, true);
      alert("Saved to favourites!");
    } catch (err: any) {
      console.error("❌ Failed to save favourite:", err);

      // Check if error is due to duplicate
      if (
        err.message?.includes("unique") ||
        err.message?.includes("duplicate")
      ) {
        alert("This item is already in your favourites!");
      } else {
        alert(err.message || "Failed to save favourite.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavourite = async () => {
    if (!currentUser || !favouriteRowId) {
      return;
    }

    setLoading(true);

    try {
      await tables.deleteRow({
        databaseId: DATABASE_ID,
        tableId: FAVOURITES_TABLE_ID,
        rowId: favouriteRowId,
      });

      onFavouriteToggle(item.id, null, false);
      alert("Removed from favourites!");
    } catch (err: any) {
      console.error("❌ Failed to remove favourite:", err);
      alert(err.message || "Failed to remove favourite.");
    } finally {
      setLoading(false);
    }
  };

  const detailUrl =
    item.subcategory !== "Alcoholic"
      ? `/dishes/${item.id}`
      : `/cocktails/${item.id}`;

  return (
    <div className="border rounded shadow p-4 hover:shadow-lg transition flex flex-col">
      <Link href={detailUrl}>
        <Image
          src={item.thumbnail || ""}
          alt={item.name}
          width={400}
          height={400}
          className="w-full h-48 object-cover rounded cursor-pointer hover:opacity-90 transition"
        />
        <h2 className="mt-2 text-lg font-semibold hover:text-blue-600 transition cursor-pointer">
          {item.name}
        </h2>
      </Link>
      {item.category && (
        <p className="text-sm text-gray-500">{item.category}</p>
      )}

      {isFavourite ? (
        <button
          className="bg-red-500 text-white px-2 py-1 rounded mt-2 self-start disabled:opacity-50"
          onClick={handleRemoveFavourite}
          disabled={loading}
        >
          {loading ? "Removing..." : "Remove"}
        </button>
      ) : (
        <button
          className="bg-yellow-400 text-white px-2 py-1 rounded mt-2 self-start disabled:opacity-50"
          onClick={handleSaveFavourite}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save"}
        </button>
      )}
    </div>
  );
}
