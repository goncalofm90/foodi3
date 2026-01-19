"use client";

import { useState, useEffect } from "react";
import { account } from "@/lib/client";
import RecipeCard from "@/components/RecipeCard";

export default function ProfilePage() {
  const [user, setUser] = useState<any | undefined>(undefined); // undefined = still loading
  const [favourites, setFavourites] = useState<any[]>([]);
  const [loadingFavourites, setLoadingFavourites] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = await account.get();
        setUser(currentUser);

        // Fetch favourites separately so errors don't affect user state
        setLoadingFavourites(true);
        try {
          const res = await fetch(`/api/favourites?userId=${currentUser.$id}`);
          if (!res.ok) {
            // Try to get the error message from the response
            const errorData = await res.json().catch(() => null);
            const errorMsg =
              errorData?.error || `Failed to fetch favourites: ${res.status}`;
            throw new Error(errorMsg);
          }
          const data = await res.json();
          setFavourites(data || []); // data is already the documents array
        } catch (favErr: any) {
          console.error("Error fetching favourites:", favErr);
          setError(favErr.message || "Failed to load favourites");
        } finally {
          setLoadingFavourites(false);
        }
      } catch (userErr) {
        console.error("Error fetching user:", userErr);
        setUser(null); // definitely not logged in
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
              key={item.itemId}
              item={{
                id: item.itemId,
                name: item.name,
                subcategory: "",
                category: item.type === "dish" ? "Dish" : "Cocktail",
                thumbnail: item.thumbnail,
                href: `/${item.type}/${item.itemId}`,
              }}
            />
          ))}
        </div>
      )}
    </main>
  );
}
