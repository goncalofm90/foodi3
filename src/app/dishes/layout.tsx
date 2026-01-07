import type { ReactNode } from "react";

export default function RecipesLayout({ children }: { children: ReactNode }) {
  return <section className="p-4">{children}</section>;
}
