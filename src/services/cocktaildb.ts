import { CardItem } from "@/types/CardItem";
import { Cocktail } from "@/types/Cocktail";

const BASE_URL = process.env.NEXT_PUBLIC_COCKTAILDB_BASE_URL;

if (!BASE_URL) {
  throw new Error("Missing BASE_URL environment variable");
}

export function mapCocktailToCardItem(drink: Cocktail): CardItem {
  return {
    id: drink.idDrink,
    name: drink.strDrink,
    category: drink.strCategory,
    subcategory: drink.strAlcoholic, // "Alcoholic" / "Non-Alcoholic"
    thumbnail: drink.strDrinkThumb,
    href: `/cocktails/${drink.idDrink}`,
  };
}

export async function searchCocktails(query: string): Promise<Cocktail[]> {
  if (!query) return [];

  const res = await fetch(`${BASE_URL}/search.php?s=${encodeURIComponent(query)}`, { cache: "no-store" });
  const data = await res.json();
  return data.drinks || [];
}

export async function getCocktailById(id: string): Promise<Cocktail | null> {
  const res = await fetch(`${BASE_URL}/lookup.php?i=${id}`, { cache: "no-store" });
  const data = await res.json();
  return data.drinks?.[0] || null;
}
