// dishes page
"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import RecipeCard from "@/components/RecipeCard";
import { searchMeals, mapMealToCardItem } from "@/services/mealdb";
import { CardItem } from "@/types/CardItem";

export default function DishesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get("q") ?? "";

  const [query, setQuery] = useState(initialQuery);
  const [dishes, setDishes] = useState<CardItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDishes = async () => {
      if (!query) {
        setDishes([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const meals = await searchMeals(query);
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
          <RecipeCard key={dish.id} item={dish} />
        ))}
      </div>
    </main>
  );
}
