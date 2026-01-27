"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import RecipeCard from "@/components/RecipeCard";
import { searchMeals, mapMealToCardItem } from "@/services/mealdb";
import { CardItem } from "@/types/CardItem";
import { account, client } from "@/lib/client";
import { TablesDB, Query } from "appwrite";

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DB_ID!;
const FAVOURITES_TABLE_ID =
  process.env.NEXT_PUBLIC_APPWRITE_FAVOURITES_TABLE_ID!;
const tables = new TablesDB(client);

export default function DishesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get("q") ?? "";

  const [query, setQuery] = useState(initialQuery);
  const [dishes, setDishes] = useState<CardItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // User and favorites state
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [favouriteItemIds, setFavouriteItemIds] = useState<Set<string>>(
    new Set(),
  );
  const [favouritesMap, setFavouritesMap] = useState<Map<string, string>>(
    new Map(),
  ); // itemId -> rowId

  // Fetch user once
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
          map.set(row.itemId, row.$id); // Store rowId for deletion
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
    const fetchDishes = async () => {
      setLoading(true);
      setError(null);

      try {
        const meals = await searchMeals(query || "a"); // default list
        setDishes(meals.map(mapMealToCardItem));
      } catch {
        setError("Failed to fetch dishes");
      } finally {
        setLoading(false);
      }
    };

    fetchDishes();
  }, [query]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.replace(`/dishes?q=${encodeURIComponent(query)}`);
    }, 300);
    return () => clearTimeout(timeout);
  }, [query, router]);

  // Handler to update favorites after add/remove
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
      <h1 className="text-3xl font-bold mb-4">Dishes</h1>

      <form
        className="mb-6"
        onSubmit={(e) => {
          e.preventDefault();
          router.push(`/dishes?q=${encodeURIComponent(query)}`);
        }}
      >
        <input
          type="text"
          name="q"
          placeholder="Search dishes..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border p-2 rounded w-full max-w-md"
        />
      </form>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && dishes.length === 0 && query && <p>No dishes found.</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {dishes.map((dish) => (
          <RecipeCard
            key={dish.id}
            item={dish}
            currentUser={currentUser}
            isFavourite={favouriteItemIds.has(dish.id)}
            favouriteRowId={favouritesMap.get(dish.id) || null}
            onFavouriteToggle={handleFavouriteToggle}
          />
        ))}
      </div>
    </main>
  );
}
