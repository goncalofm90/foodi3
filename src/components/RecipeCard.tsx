import Image from "next/image";
import { CardItem } from "@/types/CardItem";

interface RecipeCardProps {
  item: CardItem;
}

export default function RecipeCard({ item }: RecipeCardProps) {
  return (
    <div className="border rounded shadow p-4 max-w-xs">
      <Image
        src={item.thumbnail}
        alt={item.name}
        width={400}
        height={400}
        className="w-full h-48 object-cover rounded"
      />
      <h2 className="mt-2 text-lg font-semibold">{item.name}</h2>
      <p className="text-sm text-gray-500">
        {item.category} {item.subcategory ? `• ${item.subcategory}` : ""}
      </p>
    </div>
  );
}
