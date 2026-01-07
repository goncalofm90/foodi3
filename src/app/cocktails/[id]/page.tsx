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

  // Helper to extract YouTube video ID
  const getYouTubeId = (url: string) => {
    const match = url.match(/(?:v=|\/)([a-zA-Z0-9_-]{11})(?:\?|&|$)/);
    return match ? match[1] : null;
  };

  const videoId = cocktail.strVideo ? getYouTubeId(cocktail.strVideo) : null;

  return (
    <main className="min-h-screen">
      <div className="p-6">
        <BackButton />
        <h1 className="text-3xl font-bold mb-6">{cocktail.strDrink}</h1>
      </div>

      <div className="w-full mb-8 grid grid-cols-1 md:grid-cols-2 gap-4 px-6">
        {cocktail.strDrinkThumb && (
          <div className="w-full h-[50vh] md:h-[70vh] relative rounded-lg overflow-hidden">
            <Image
              src={cocktail.strDrinkThumb}
              alt={cocktail.strDrink}
              fill
              className="object-cover"
            />
          </div>
        )}

        {videoId && (
          <div className="w-full h-[50vh] md:h-[70vh] rounded-lg overflow-hidden">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              title={cocktail.strDrink}
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="mb-6 flex flex-wrap gap-3">
          <p className="bg-gray-800 p-2 rounded">
            <strong>Category:</strong> {cocktail.strCategory}
          </p>
          {cocktail.strIBA && (
            <p className="bg-gray-800 p-2 rounded">
              <strong>IBA:</strong> {cocktail.strIBA}
            </p>
          )}
          <p className="bg-gray-800 p-2 rounded">
            <strong>Alcoholic:</strong> {cocktail.strAlcoholic}
          </p>
          {cocktail.strGlass && (
            <p className="bg-gray-800 p-2 rounded">
              <strong>Glass:</strong> {cocktail.strGlass}
            </p>
          )}
          {cocktail.strTags && (
            <p className="bg-gray-800 p-2 rounded">
              <strong>Tags:</strong> {cocktail.strTags}
            </p>
          )}
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
          <p className="whitespace-pre-line">{cocktail.strInstructions}</p>
        </section>
      </div>
    </main>
  );
}
