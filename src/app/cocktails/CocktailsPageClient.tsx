"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import RecipeCard from "@/components/RecipeCard";
import { searchCocktails, mapCocktailToCardItem } from "@/services/cocktaildb";
import { CardItem } from "@/types/CardItem";
import { account, client } from "@/lib/client";
import { TablesDB, Query } from "appwrite";

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DB_ID!;
const FAVOURITES_TABLE_ID =
  process.env.NEXT_PUBLIC_APPWRITE_FAVOURITES_TABLE_ID!;
const tables = new TablesDB(client);

export default function CocktailsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get("q") ?? "";

  const [query, setQuery] = useState(initialQuery);
  const [cocktails, setCocktails] = useState<CardItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // User and favorites state
  const [currentUser, setCurrentUser] = useState<any>(null);
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
        const user = await account.get();
        setCurrentUser(user);
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

        response.rows?.forEach((row: any) => {
          itemIds.add(row.itemId);
          map.set(row.itemId, row.$id);
        });

        setFavouriteItemIds(itemIds);
        setFavouritesMap(map);
      } catch (err) {
        console.error("Error fetching favourites:", err);
      }
    };

    fetchFavourites();
  }, [currentUser]);

  useEffect(() => {
    const fetchCocktails = async () => {
      setLoading(true);
      setError(null);

      try {
        const cocktails = await searchCocktails(query || "a"); // default list
        setCocktails(cocktails.map(mapCocktailToCardItem));
      } catch {
        setError("Failed to fetch cocktails");
      } finally {
        setLoading(false);
      }
    };

    fetchCocktails();
  }, [query]);

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
    }
  };

  return (
    <main className="p-4">
      <h1 className="text-3xl font-bold mb-4">Cocktails</h1>

      <form
        className="mb-6"
        onSubmit={(e) => {
          e.preventDefault();
          router.push(`/cocktails?q=${encodeURIComponent(query)}`);
        }}
      >
        <input
          type="text"
          name="q"
          placeholder="Search cocktails..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border p-2 rounded w-full max-w-md"
        />
      </form>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && cocktails.length === 0 && query && (
        <p>No cocktails found.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
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
    </main>
  );
}
