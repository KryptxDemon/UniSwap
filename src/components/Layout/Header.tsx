import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MessageCircle, User, PlusCircle, LogOut, BookOpen } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export function Header() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-blue-600 p-2 rounded-lg group-hover:bg-blue-700 transition-colors">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">UniSwap</span>
          </Link>

          {/* Navigation */}
          {user ? (
            <div className="flex items-center space-x-4">
              <Link
                to="/browse"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Browse
              </Link>
              <Link
                to="/post-item"
                className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <PlusCircle className="h-4 w-4" />
                <span>Post Item</span>
              </Link>
              <Link
                to="/messages"
                className="text-gray-700 hover:text-blue-600 p-2 rounded-md transition-colors"
              >
                <MessageCircle className="h-5 w-5" />
              </Link>
              <Link
                to="/profile"
                className="text-gray-700 hover:text-blue-600 p-2 rounded-md transition-colors"
              >
                <User className="h-5 w-5" />
              </Link>
              <button
                onClick={handleSignOut}
                className="text-gray-700 hover:text-red-600 p-2 rounded-md transition-colors"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link
                to="/browse"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Browse
              </Link>
              <Link
                to="/login"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}