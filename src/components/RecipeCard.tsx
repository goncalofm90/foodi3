"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { client } from "@/lib/client";
import { CardItem } from "@/types/CardItem";
import { TablesDB, ID } from "appwrite";
import { Heart } from "lucide-react";
import { useToast } from "@/contexts/ToastContext";

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
  const { showSuccess, showError } = useToast();

  const handleSaveFavourite = async () => {
    if (!currentUser) {
      showError("Please login to save favourites!");
      return;
    }

    if (isFavourite) {
      showError("Already in your favourites!");
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
    } catch (err: any) {
      console.error("❌ Failed to save favourite:", err);

      if (
        err.message?.includes("unique") ||
        err.message?.includes("duplicate")
      ) {
        showError("This item is already in your favourites!");
      } else {
        showError(err.message || "Failed to save favourite");
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
    } catch (err: any) {
      console.error("❌ Failed to remove favourite:", err);
      showError(err.message || "Failed to remove favourite");
    } finally {
      setLoading(false);
    }
  };

  const detailUrl =
    item.subcategory !== "Alcoholic"
      ? `/dishes/${item.id}`
      : `/cocktails/${item.id}`;

  const isAlcoholic = item.subcategory === "Alcoholic";

  return (
    <article className="group relative bg-white rounded-card shadow-soft hover:shadow-lifted transition-all duration-300 overflow-hidden animate-scale-in">
      <Link
        href={detailUrl}
        className="block relative aspect-[4/3] overflow-hidden bg-neutral-100"
      >
        <Image
          src={item.thumbnail || "/placeholder-recipe.jpg"}
          alt={item.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="absolute top-3 left-3 z-10">
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${
              isAlcoholic
                ? "bg-primary-500/90 text-white"
                : "bg-accent-500/90 text-white"
            }`}
          >
            {item.category || (isAlcoholic ? "Cocktail" : "Dish")}
          </span>
        </div>
      </Link>

      <div className="p-5">
        <Link href={detailUrl} className="block mb-3">
          <h2 className="font-accent text-heading-md text-neutral-900 group-hover:text-primary-600 transition-colors line-clamp-2">
            {item.name}
          </h2>
        </Link>

        <button
          onClick={isFavourite ? handleRemoveFavourite : handleSaveFavourite}
          disabled={loading}
          className={`
            flex items-center gap-2 px-4 py-2.5 rounded-button font-medium text-sm
            transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
            ${
              isFavourite
                ? "bg-error/10 text-error hover:bg-error hover:text-white"
                : "bg-primary-500 text-white hover:bg-primary-600 shadow-sm hover:shadow-md"
            }
          `}
        >
          <Heart
            className={`w-4 h-4 transition-transform ${
              isFavourite ? "fill-current scale-110" : ""
            } ${loading ? "animate-pulse" : ""}`}
          />
          <span>
            {loading
              ? isFavourite
                ? "Removing..."
                : "Saving..."
              : isFavourite
                ? "Remove"
                : "Save"}
          </span>
        </button>
      </div>
    </article>
  );
}
