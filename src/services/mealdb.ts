import { CardItem } from "@/types/CardItem";
import { Meal } from "@/types/Meal";

const BASE_URL = process.env.NEXT_PUBLIC_MEALDB_BASE_URL;

if (!BASE_URL) {
  throw new Error("Missing BASE_URL environment variable");
}

export function mapMealToCardItem(meal: Meal): CardItem {
  return {
    id: meal.idMeal,
    name: meal.strMeal,
    category: meal.strCategory,
    subcategory: meal.strArea,
    thumbnail: meal.strMealThumb,
  };
}

export async function searchMeals(query: string): Promise<Meal[]> {
  if (!query) return [];

  const res = await fetch(`${BASE_URL}/search.php?s=${encodeURIComponent(query)}`, { cache: "no-store" });
  const data = await res.json();
  return data.meals || [];
}
