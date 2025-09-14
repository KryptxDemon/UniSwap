import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  useParams,
} from "react-router-dom";
import { Header } from "./components/Layout/Header";
import { Footer } from "./components/Layout/Footer";
import HomePage from "./pages/HomePage";
import { BrowsePage } from "./pages/BrowsePage";
import { BrowseItemsPage } from "./pages/BrowseItemsPage";
import { BrowseTuitionsPage } from "./pages/BrowseTuitionsPage";
import { PostItemPage } from "./pages/PostItemPage";
import { ItemDetailPage } from "./pages/ItemDetailPage";
import { TuitionDetailPage } from "./pages/TuitionDetailPage";
import { ProfilePage } from "./pages/ProfilePage";
import { MessagesPage } from "./pages/MessagesPage";
import { LoginForm } from "./components/Auth/LoginForm";
import { SignupForm } from "./components/Auth/SignupForm";
import { PostTuitionPage } from "./pages/PostTuitionPage";
import { EditProfilePage } from "./pages/editprofile";
import { useAuth } from "./hooks/useAuth";

function AppContent() {
  const location = useLocation();
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const noHeaderRoutes = ["/"];
  const noFooterRoutes: string[] = [];
  const hideHeader = noHeaderRoutes.includes(location.pathname);
  const hideFooter = noFooterRoutes.includes(location.pathname);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {!hideHeader && <Header />}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/browse" element={<BrowsePage />} />
          <Route path="/browse/items" element={<BrowseItemsPage />} />
          <Route path="/browse/tuitions" element={<BrowseTuitionsPage />} />
          <Route path="/post-item" element={<PostItemPage />} />
          <Route path="/post-tuition" element={<PostTuitionPage />} />
          <Route path="/item/:id" element={<ItemDetailPage />} />
          <Route path="/tuition/:id" element={<TuitionDetailPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/:id" element={<ProfilePage />} />
          <Route
            path="/profile/:id/edit"
            element={<EditProfilePageWrapper />}
          />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
}

function EditProfilePageWrapper() {
  const { id } = useParams();
  return id ? <EditProfilePage userId={id} /> : <Navigate to="/" replace />;
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
