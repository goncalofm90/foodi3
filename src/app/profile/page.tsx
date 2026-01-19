import ProtectedRoute from "@/components/ProtectedRoute";
import ProfilePage from "./profilePageClient";

export default function ProfilePageWrapper() {
  return (
    <ProtectedRoute>
      <ProfilePage />
    </ProtectedRoute>
  );
}
