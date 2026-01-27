import { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import PrivateWrapper from "@/components/PrivateWrapper";

export default function DishesLayout({ children }: { children: ReactNode }) {
  return (
    <PrivateWrapper>
      <Navbar />
      <main className="p-4">{children}</main>
    </PrivateWrapper>
  );
}
