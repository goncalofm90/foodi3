// src/services/mealdb.ts
const BASE_URL = process.env.NEXT_PUBLIC_MEALDB_BASE_URL

if (!BASE_URL) {
  throw new Error("Missing BASE_URL environment variable");
}

export interface Meal {
  idMeal: string;
  strMeal: string;
  strCategory: string;
  strArea: string;
  strMealThumb: string;
}

export async function searchMeals(query: string): Promise<Meal[]> {
  if (!query) return [];


  const res = await fetch(`${BASE_URL}/search.php?s=${query}`, { cache: "no-store" });
  const data = await res.json();
  return data.meals || [];
}
