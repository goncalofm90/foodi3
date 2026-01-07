// cocktails page
"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import RecipeCard from "@/components/RecipeCard";
import { searchCocktails, mapCocktailToCardItem } from "@/services/cocktaildb";
import { CardItem } from "@/types/CardItem";

export default function CocktailsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get("q") ?? "";

  const [query, setQuery] = useState(initialQuery);
  const [cocktails, setCocktails] = useState<CardItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCocktails = async () => {
      if (!query) {
        setCocktails([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const drinks = await searchCocktails(query);
        setCocktails(drinks.map(mapCocktailToCardItem));
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
      {!loading && cocktails.length === 0 && query && <p>No cocktails found.</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {cocktails.map((cocktail) => (
          <RecipeCard key={cocktail.id} item={cocktail} />
        ))}
      </div>
    </main>
  );
}
