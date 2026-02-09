"use client";
import { useState, useEffect } from "react";
import { account, client } from "@/lib/client";
import { TablesDB, Query } from "appwrite";
import RecipeCard from "@/components/RecipeCard";
import { useToast } from "@/contexts/ToastContext";
import CocktailLoader from "@/components/Loader";

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DB_ID!;
const FAVOURITES_TABLE_ID =
  process.env.NEXT_PUBLIC_APPWRITE_FAVOURITES_TABLE_ID!;
const tables = new TablesDB(client);

export default function ProfilePage() {
  const { showSuccess, showError, showToast } = useToast();
  const [user, setUser] = useState<any | undefined>(undefined);
  const [favourites, setFavourites] = useState<any[]>([]);
  const [loadingFavourites, setLoadingFavourites] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Create sets/maps for RecipeCard props
  const [favouriteItemIds, setFavouriteItemIds] = useState<Set<string>>(
    new Set(),
  );
  const [favouritesMap, setFavouritesMap] = useState<Map<string, string>>(
    new Map(),
  );

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = await account.get();
        setUser(currentUser);
        setLoadingFavourites(true);

        try {
          const userFavs = await tables.listRows({
            databaseId: DATABASE_ID,
            tableId: FAVOURITES_TABLE_ID,
            queries: [Query.equal("userId", currentUser.$id)],
          });

          const favRows = userFavs.rows || [];
          setFavourites(favRows);

          const itemIds = new Set<string>();
          const map = new Map<string, string>();

          favRows.forEach((row: any) => {
            itemIds.add(row.itemId);
            map.set(row.itemId, row.$id); // itemId : rowId lookup
          });

          setFavouriteItemIds(itemIds);
          setFavouritesMap(map);
        } catch (favErr: any) {
          console.error("❌ Error:", favErr);
          const errorMessage = favErr.message || "Failed to load favourites";
          setError(errorMessage);
          showError(errorMessage);
        } finally {
          setLoadingFavourites(false);
        }
      } catch (userErr) {
        console.error("❌ Error fetching user:", userErr);
        setUser(null);
        showError("Failed to load user profile");
      }
    };

    fetchUserData();
  }, [showError]);

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
      setFavourites((prev) => prev.filter((fav) => fav.itemId !== itemId));
      showToast("Removed from favorites", "info");
    }
  };

  if (user === undefined) return <CocktailLoader />;
  if (!user) return <p className="p-4">Please log in to see your profile.</p>;

  return (
    <main className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="font-display text-display-md text-neutral-900 mb-2">
          Hello, {user.name || user.email}
        </h1>
        <h2 className="font-accent text-heading-lg text-neutral-700 mb-8">
          Your Favourites
        </h2>

        {error && (
          <div className="bg-error/10 border border-error/20 text-error px-4 py-3 rounded-button mb-4">
            {error}
          </div>
        )}

        {loadingFavourites ? (
          <p className="text-neutral-600">Loading favourites...</p>
        ) : favourites.length === 0 ? (
          <p className="text-neutral-600">
            No favourites yet. Start adding some!
          </p>
        ) : (
          <div className="recipe-grid">
            {favourites.map((item) => (
              <RecipeCard
                key={item.$id}
                item={{
                  id: item.itemId,
                  name: item.itemName,
                  subcategory:
                    item.itemType === "dish" ? "NotAlcoholic" : "Alcoholic",
                  category: item.itemType === "dish" ? "Dish" : "Cocktail",
                  thumbnail: item.thumbnail,
                }}
                currentUser={user}
                isFavourite={favouriteItemIds.has(item.itemId)}
                favouriteRowId={favouritesMap.get(item.itemId) || null}
                onFavouriteToggle={handleFavouriteToggle}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
