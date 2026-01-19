import ProtectedRoute from "@/components/ProtectedRoute";
import CocktailsPage from "./CocktailsPageClient";

export default function CocktailsPageWrapper() {
  return (
    <ProtectedRoute>
      <CocktailsPage />
    </ProtectedRoute>
  );
}
