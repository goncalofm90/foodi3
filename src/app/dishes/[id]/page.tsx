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
    <main className="min-h-screen bg-neutral-50">
      <div className="max-w-5xl mx-auto p-6">
        <BackButton />

        <h1 className="font-accent text-display-md text-neutral-900 mb-6 animate-fade-in">
          {meal.strMeal}
        </h1>

        {meal.strMealThumb && (
          <div className="w-full h-[50vh] md:h-[70vh] relative rounded-card overflow-hidden shadow-soft mb-8 group animate-slide-up">
            <Image
              src={meal.strMealThumb}
              alt={meal.strMeal}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        )}

        <div className="mb-8 flex flex-wrap gap-3">
          <span className="bg-primary-500/10 text-primary-500 rounded-button px-3 py-1 font-medium">
            {meal.strCategory}
          </span>
          <span className="bg-accent-500/10 text-accent-500 rounded-button px-3 py-1 font-medium">
            {meal.strArea}
          </span>
        </div>

        <section className="mb-8">
          <h2 className="font-accent text-heading-lg mb-3 animate-fade-in">
            Ingredients
          </h2>
          <ul className="flex flex-wrap gap-2">
            {ingredients.map((item, index) => (
              <li
                key={index}
                className="font-body text-primary-700 bg-primary-50 rounded-button px-3 py-1 shadow-inner-soft transition-transform duration-200 hover:scale-105"
              >
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="font-accent text-heading-lg mb-3 animate-fade-in">
            Instructions
          </h2>

          <div className="font-body text-neutral-800 rounded-card bg-accent-50 p-6 shadow-soft whitespace-pre-line leading-relaxed">
            {meal.strInstructions}
          </div>
        </section>
      </div>
    </main>
  );
}
