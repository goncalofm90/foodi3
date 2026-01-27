import { ReactNode } from "react";
import PrivateWrapper from "@/components/PrivateWrapper";

export default function DishesLayout({ children }: { children: ReactNode }) {
  return <PrivateWrapper>{children}</PrivateWrapper>;
}
