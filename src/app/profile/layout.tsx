import Navbar from "@/components/Navbar";

export default function ProfileLayout({
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
