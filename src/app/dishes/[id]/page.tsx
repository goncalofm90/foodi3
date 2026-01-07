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
    <main className="min-h-screen">
      <div className="p-6">
        <BackButton />
        <h1 className="text-3xl font-bold mb-6">{meal.strMeal}</h1>
      </div>

      <div className="w-full mb-8 grid grid-cols-1 md:grid-cols-2 gap-4 px-6">
        {meal.strMealThumb && (
          <div className="w-full h-[50vh] md:h-[70vh] relative rounded-lg overflow-hidden">
            <Image
              src={meal.strMealThumb}
              alt={meal.strMeal}
              fill
              className="object-cover"
            />
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="mb-6 flex flex-wrap gap-3">
          <p className="bg-gray-800 p-2 rounded">
            <strong>Category:</strong> {meal.strCategory}
          </p>
          <p className="bg-gray-800 p-2 rounded">
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

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">Instructions</h2>
          <p className="whitespace-pre-line">{meal.strInstructions}</p>
        </section>
      </div>
    </main>
  );
}
