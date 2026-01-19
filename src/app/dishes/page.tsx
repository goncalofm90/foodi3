import ProtectedRoute from "@/components/ProtectedRoute";
import DishesPage from "./DishesPageClient";

export default function DishesPageWrapper() {
  return (
    <ProtectedRoute>
      <DishesPage />
    </ProtectedRoute>
  );
}
