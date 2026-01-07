"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import RecipeCard from "@/components/RecipeCard";
import { searchMeals } from "@/services/mealdb";

export default function RecipesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get("q") ?? "";

  const [query, setQuery] = useState(initialQuery);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch meals when query changes
    useEffect(() => {
    const fetchMeals = async () => {
        if (!query) {
        setMeals([]);
        return;
        }

        setLoading(true);
        setError(null);

        try {
        const data = await searchMeals(query);
        setMeals(data);
        } catch {
        setError("Failed to fetch meals");
        } finally {
        setLoading(false);
        }
    };

    fetchMeals();
    }, [query]);


  return (
    <main className="p-4">
      <h1 className="text-3xl font-bold mb-4">Recipes</h1>

      <form
        className="mb-6"
        onSubmit={(e) => {
          e.preventDefault();
          router.push(`/recipes?q=${encodeURIComponent(query)}`);
        }}
      >
        <input
          type="text"
          name="q"
          placeholder="Search meals..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border p-2 rounded w-full max-w-md"
        />
      </form>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && meals.length === 0 && query && <p>No recipes found.</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {meals.map((meal) => (
          <RecipeCard key={meal.idMeal} meal={meal} />
        ))}
      </div>
    </main>
  );
}