"use client";
import { useState, useEffect } from "react";
import { account, client } from "@/lib/client";
import { TablesDB, Query } from "appwrite";
import RecipeCard from "@/components/RecipeCard";

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DB_ID!;
const FAVOURITES_TABLE_ID =
  process.env.NEXT_PUBLIC_APPWRITE_FAVOURITES_TABLE_ID!;
const tables = new TablesDB(client);

export default function ProfilePage() {
  const [user, setUser] = useState<any | undefined>(undefined);
  const [favourites, setFavourites] = useState<any[]>([]);
  const [loadingFavourites, setLoadingFavourites] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = await account.get();
        setUser(currentUser);
        setLoadingFavourites(true);

        try {
          // Query for ONLY current user's favourites using Query helper
          const userFavs = await tables.listRows({
            databaseId: DATABASE_ID,
            tableId: FAVOURITES_TABLE_ID,
            queries: [Query.equal("userId", currentUser.$id)],
          });

          setFavourites(userFavs.rows || []);
        } catch (favErr: any) {
          console.error("❌ Error:", favErr);
          setError(favErr.message);
        } finally {
          setLoadingFavourites(false);
        }
      } catch (userErr) {
        console.error("❌ Error fetching user:", userErr);
        setUser(null);
      }
    };

    fetchUserData();
  }, []);
  if (user === undefined) return <p className="p-4">Loading profile...</p>;
  if (!user) return <p className="p-4">Please log in to see your profile.</p>;

  return (
    <main className="p-4">
      <h1 className="text-3xl font-bold mb-4">
        Hello, {user.name || user.email}
      </h1>
      <h2 className="text-2xl font-semibold mb-2">Your Favourites</h2>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      {loadingFavourites ? (
        <p>Loading favourites...</p>
      ) : favourites.length === 0 ? (
        <p>No favourites yet. Start adding some!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
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
            />
          ))}
        </div>
      )}
    </main>
  );
}
