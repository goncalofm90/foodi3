"use client";

import Image from "next/image";
import Link from "next/link";
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
  const [isFavourite, setIsFavourite] = useState(false);
  const [favouriteRowId, setFavouriteRowId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    const checkIfFavourite = async () => {
      if (!currentUser) return;

      try {
        const existing = await tables.listRows({
          databaseId: DATABASE_ID,
          tableId: FAVOURITES_TABLE_ID,
          queries: [
            Query.equal("userId", currentUser.$id),
            Query.equal("itemId", item.id),
          ],
        });

        if (existing.rows && existing.rows.length > 0) {
          setIsFavourite(true);
          setFavouriteRowId(existing.rows[0].$id);
        } else {
          setIsFavourite(false);
          setFavouriteRowId(null);
        }
      } catch (err) {
        console.error("Error checking favourite status:", err);
      }
    };

    checkIfFavourite();
  }, [currentUser, item.id]);

  const handleSaveFavourite = async () => {
    if (!currentUser) {
      alert("Please login to save favourites!");
      return;
    }

    setLoading(true);

    try {
      // Check for duplicates
      const existing = await tables.listRows({
        databaseId: DATABASE_ID,
        tableId: FAVOURITES_TABLE_ID,
        queries: [
          Query.equal("userId", currentUser.$id),
          Query.equal("itemId", item.id),
        ],
      });

      if (existing.rows && existing.rows.length > 0) {
        alert("You already have this in your favourites!");
        setLoading(false);
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
          itemType: item.subcategory === "Alcoholic" ? "cocktail" : "dish",
          thumbnail: item.thumbnail,
        },
        read: [`user:${currentUser.$id}`],
        write: [`user:${currentUser.$id}`],
      });

      setIsFavourite(true);
      setFavouriteRowId(uniqueRowId);
      alert("Saved to favourites!");
    } catch (err: any) {
      console.error("❌ Failed to save favourite:", err);
      alert(err.message || "Failed to save favourite.");
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

      setIsFavourite(false);
      setFavouriteRowId(null);
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
