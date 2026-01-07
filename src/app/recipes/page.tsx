import RecipeCard from "@/components/RecipeCard";
import { searchMeals } from "@/services/mealdb";

interface RecipesPageProps {
  searchParams?: Promise<{ [key: string]: string | string[] }>;
}

export default async function RecipesPage({ searchParams }: RecipesPageProps) {
  const resolvedSearchParams = await searchParams;
  const query = typeof resolvedSearchParams?.q === "string" ? resolvedSearchParams.q : "";

  const meals = await searchMeals(query);

  return (
    <main className="p-4">
      <h1 className="text-3xl font-bold mb-4">Recipes</h1>

      <form className="mb-6">
        <input
          type="text"
          name="q"
          placeholder="Search meals..."
          defaultValue={query}
          className="border p-2 rounded w-full max-w-md"
        />
      </form>

      {meals.length === 0 ? (
        <p>No recipes found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {meals.map((meal) => (
            <RecipeCard key={meal.idMeal} meal={meal} />
          ))}
        </div>
      )}
    </main>
  );
}