import { Meal } from "@/services/mealdb";
import Image from "next/image";


export default function RecipeCard({ meal }: { meal: Meal }) {
  return (
    <div className="border rounded shadow p-4 max-w-xs">
      <Image
        src={meal.strMealThumb}
        alt={meal.strMeal}
        width={400} 
        height={400} 
        className="w-full h-48 object-cover rounded"
        priority={false}
      />
      <h2 className="mt-2 text-lg font-semibold">{meal.strMeal}</h2>
      <p className="text-sm text-gray-500">
        {meal.strCategory} • {meal.strArea}
      </p>
    </div>
  );
}

