"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import RecipeCard from "@/components/RecipeCard";
import { searchCocktails, mapCocktailToCardItem } from "@/services/cocktaildb";
import { CardItem } from "@/types/CardItem";
import { account, client } from "@/lib/client";
import { TablesDB, Query } from "appwrite";
import { useToast } from "@/contexts/ToastContext";
import CocktailLoader from "@/components/Loader";
import { User } from "@/types/User";
import { FavouriteRow } from "@/types/FavouriteRow";

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DB_ID!;
const FAVOURITES_TABLE_ID =
  process.env.NEXT_PUBLIC_APPWRITE_FAVOURITES_TABLE_ID!;
const tables = new TablesDB(client);

export default function CocktailsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { showSuccess, showError, showToast } = useToast();
  const initialQuery = searchParams.get("q") ?? "";

  const [query, setQuery] = useState(initialQuery);
  const [cocktails, setCocktails] = useState<CardItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // User and favorites state
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [favouriteItemIds, setFavouriteItemIds] = useState<Set<string>>(
    new Set(),
  );
  const [favouritesMap, setFavouritesMap] = useState<Map<string, string>>(
    new Map(),
  );

  // Fetch user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser: User = await account.get();
        setCurrentUser(currentUser);
      } catch {
        setCurrentUser(null);
      }
    };
    fetchUser();
  }, []);

  // Fetch all user's favorites once when user is available
  useEffect(() => {
    const fetchFavourites = async () => {
      if (!currentUser) {
        setFavouriteItemIds(new Set());
        setFavouritesMap(new Map());
        return;
      }

      try {
        const response = await tables.listRows({
          databaseId: DATABASE_ID,
          tableId: FAVOURITES_TABLE_ID,
          queries: [Query.equal("userId", currentUser.$id)],
        });

        const itemIds = new Set<string>();
        const map = new Map<string, string>();

        response.rows?.forEach((row) => {
          const favRow = row as unknown as FavouriteRow;
          itemIds.add(favRow.itemId);
          map.set(favRow.itemId, favRow.$id);
        });

        setFavouriteItemIds(itemIds);
        setFavouritesMap(map);
      } catch (err) {
        console.error("Error fetching favourites:", err);
        showError("Failed to load your favorites");
      }
    };

    fetchFavourites();
  }, [currentUser, showError]);

  useEffect(() => {
    const fetchCocktails = async () => {
      setLoading(true);
      setError(null);

      try {
        const cocktails = await searchCocktails(query || "a");
        setCocktails(cocktails.map(mapCocktailToCardItem));
      } catch {
        const errorMessage = "Failed to fetch cocktails";
        setError(errorMessage);
        showError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchCocktails();
  }, [query, showError]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.replace(`/cocktails?q=${encodeURIComponent(query)}`);
    }, 300);
    return () => clearTimeout(timeout);
  }, [query, router]);

  // update favorites after add/remove
  const handleFavouriteToggle = (
    itemId: string,
    rowId: string | null,
    isAdding: boolean,
  ) => {
    if (isAdding && rowId) {
      setFavouriteItemIds((prev) => new Set(prev).add(itemId));
      setFavouritesMap((prev) => new Map(prev).set(itemId, rowId));
      showSuccess("Added to favorites!");
    } else {
      setFavouriteItemIds((prev) => {
        const next = new Set(prev);
        next.delete(itemId);
        return next;
      });
      setFavouritesMap((prev) => {
        const next = new Map(prev);
        next.delete(itemId);
        return next;
      });
      showToast("Removed from favorites", "info");
    }
  };

  return (
    <main className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="font-display text-display-md text-neutral-900 mb-8">
          Discover Cocktails
        </h1>

        <form
          className="mb-12"
          onSubmit={(e) => {
            e.preventDefault();
            router.push(`/cocktails?q=${encodeURIComponent(query)}`);
          }}
        >
          <input
            type="text"
            name="q"
            placeholder="Search for delicious cocktails..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="search-input"
          />
        </form>

        {loading && <CocktailLoader />}
        {!loading && cocktails.length === 0 && query && (
          <p className="text-neutral-600">No cocktails found.</p>
        )}

        <div className="recipe-grid">
          {cocktails.map((cocktail) => (
            <RecipeCard
              key={cocktail.id}
              item={cocktail}
              currentUser={currentUser}
              isFavourite={favouriteItemIds.has(cocktail.id)}
              favouriteRowId={favouritesMap.get(cocktail.id) || null}
              onFavouriteToggle={handleFavouriteToggle}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
