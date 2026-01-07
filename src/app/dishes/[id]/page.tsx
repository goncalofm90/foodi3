// src/app/dishes/[id]/page.tsx
import Image from "next/image";
import { getMealById } from "@/services/mealdb";
import BackButton from "@/components/BackButton";

interface DishDetailProps {
  params: Promise<{ id: string }>;
}

export default async function DishDetail({ params }: DishDetailProps) {
  const { id } = await params;

  const meal = await getMealById(id);

  if (!meal) {
    return <p className="p-4">Dish not found.</p>;
  }

  const ingredients = Array.from({ length: 20 })
    .map((_, i) => {
      const ingredient = meal[`strIngredient${i + 1}` as keyof typeof meal];
      const measure = meal[`strMeasure${i + 1}` as keyof typeof meal];

      if (!ingredient || ingredient.trim() === "") return null;
      return `${measure ?? ""} ${ingredient}`.trim();
    })
    .filter(Boolean) as string[];

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <BackButton />
      <h1 className="text-3xl font-bold mb-4">{meal.strMeal}</h1>

      {meal.strMealThumb && (
        <Image
          src={meal.strMealThumb}
          alt={meal.strMeal}
          width={600}
          height={600}
          className="rounded mb-6"
        />
      )}

      <div className="mb-6 text-gray-600">
        <p>
          <strong>Category:</strong> {meal.strCategory}
        </p>
        <p>
          <strong>Area:</strong> {meal.strArea}
        </p>
      </div>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Ingredients</h2>
        <ul className="list-disc list-inside space-y-1">
          {ingredients.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-2">Instructions</h2>
        <p className="whitespace-pre-line text-gray-700">
          {meal.strInstructions}
        </p>
      </section>
    </main>
  );
}
