import Navbar from "@/components/Navbar";

export default function CocktailsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="p-4">{children}</main>
    </>
  );
}
