// src/app/dishes/[id]/page.tsx
import Image from "next/image";
import { getCocktailById } from "@/services/cocktaildb";
import BackButton from "@/components/BackButton";

interface CocktailDetailProps {
  params: Promise<{ id: string }>;
}

export default async function CocktailDetail({ params }: CocktailDetailProps) {
  const { id } = await params;

  const cocktail = await getCocktailById(id);

  if (!cocktail) {
    return <p className="p-4">Cocktail not found.</p>;
  }

  const ingredients = Array.from({ length: 20 })
    .map((_, i) => {
      const ingredient =
        cocktail[`strIngredient${i + 1}` as keyof typeof cocktail];
      const measure = cocktail[`strMeasure${i + 1}` as keyof typeof cocktail];

      if (!ingredient || ingredient.trim() === "") return null;
      return `${measure ?? ""} ${ingredient}`.trim();
    })
    .filter(Boolean) as string[];

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <BackButton />
      <h1 className="text-3xl font-bold mb-4">{cocktail.strDrink}</h1>

      {cocktail.strDrinkThumb && (
        <Image
          src={cocktail.strDrinkThumb}
          alt={cocktail.strDrink}
          width={600}
          height={600}
          className="rounded mb-6"
        />
      )}

      <div className="mb-6 text-gray-600">
        <p>
          <strong>Category:</strong> {cocktail.strCategory}
        </p>
        <p>
          <strong>Area:</strong> {cocktail.strArea}
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
          {cocktail.strInstructions}
        </p>
      </section>
    </main>
  );
}
