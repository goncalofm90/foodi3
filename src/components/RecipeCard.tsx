import Image from "next/image";
import Link from "next/link";
import { CardItem } from "@/types/CardItem";

interface RecipeCardProps {
  item: CardItem;
}

export default function RecipeCard({ item }: RecipeCardProps) {
  return (
    <Link href={item.href} className="block">
      <div className="border rounded shadow p-4 hover:shadow-lg transition">
        {item.thumbnail && (
          <Image
            src={item.thumbnail}
            alt={item.name}
            width={400}
            height={400}
            className="w-full h-48 object-cover rounded"
          />
        )}

        <h2 className="mt-2 text-lg font-semibold">{item.name}</h2>

        {item.category && (
          <p className="text-sm text-gray-500">{item.category}</p>
        )}
      </div>
    </Link>
  );
}
