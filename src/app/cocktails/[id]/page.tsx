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
    <main className="min-h-screen bg-neutral-50">
      <div className="max-w-5xl mx-auto p-6">
        <BackButton />

        <h1 className="font-accent text-display-md text-neutral-900 mb-6 animate-fade-in">
          {cocktail.strDrink}
        </h1>

        <div className="w-full mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          {cocktail.strDrinkThumb && (
            <div className="w-full h-[50vh] md:h-[70vh] relative rounded-card overflow-hidden shadow-soft group animate-slide-up">
              <Image
                src={cocktail.strDrinkThumb}
                alt={cocktail.strDrink}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          )}

          {cocktail.strVideo && (
            <div className="w-full h-[50vh] md:h-[70vh] rounded-card overflow-hidden shadow-soft animate-slide-up">
              <iframe
                src={`https://www.youtube.com/embed/${videoId}`}
                title={cocktail.strDrink}
                allowFullScreen
                className="w-full h-full rounded-card"
              />
            </div>
          )}
        </div>

        <div className="mb-8 flex flex-wrap gap-3">
          <span className="bg-primary-500/10 text-primary-500 rounded-button px-3 py-1 font-medium">
            {cocktail.strCategory}
          </span>
          {cocktail.strIBA && (
            <span className="bg-accent-500/10 text-accent-500 rounded-button px-3 py-1 font-medium">
              {cocktail.strIBA}
            </span>
          )}
          <span className="bg-warning/10 text-warning rounded-button px-3 py-1 font-medium">
            {cocktail.strAlcoholic}
          </span>
          {cocktail.strGlass && (
            <span className="bg-neutral-200 text-neutral-800 rounded-button px-3 py-1 font-medium">
              {cocktail.strGlass}
            </span>
          )}
          {cocktail.strTags && (
            <span className="bg-primary-100 text-primary-700 rounded-button px-3 py-1 font-medium">
              {cocktail.strTags}
            </span>
          )}
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
            {cocktail.strInstructions}
          </div>
        </section>
      </div>
    </main>
  );
}
