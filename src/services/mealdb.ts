// src/services/mealdb.ts
const BASE_URL = process.env.MEALDB_BASE_URL

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

  console.log(query,'query');

  const res = await fetch(`${BASE_URL}/search.php?s=${query}`, { cache: "no-store" });
  console.log(res,'res')
  const data = await res.json();
  console.log(data,'data')
  return data.meals || [];
}
