// src/app/cocktails/layout.tsx
import { ReactNode } from "react";
import PrivateWrapper from "@/components/PrivateWrapper";

export default function CocktailsLayout({ children }: { children: ReactNode }) {
  return <PrivateWrapper>{children}</PrivateWrapper>;
}
