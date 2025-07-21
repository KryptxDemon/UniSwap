import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/Layout/Header';
import { Footer } from './components/Layout/Footer';
import { HomePage } from './pages/HomePage';
import { BrowseItemsPage } from './pages/BrowseItemsPage';
import { PostItemPage } from './pages/PostItemPage';
import { LoginForm } from './components/Auth/LoginForm';
import { SignupForm } from './components/Auth/SignupForm';
import { useAuth } from './hooks/useAuth';

function App() {
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

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/browse" element={<BrowseItemsPage />} />
            <Route path="/post-item" element={<PostItemPage />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/signup" element={<SignupForm />} />
            <Route path="/messages" element={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><p className="text-gray-600">Messages feature coming soon!</p></div>} />
            <Route path="/profile" element={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><p className="text-gray-600">Profile feature coming soon!</p></div>} />
            <Route path="/item/:id" element={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><p className="text-gray-600">Item detail feature coming soon!</p></div>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;