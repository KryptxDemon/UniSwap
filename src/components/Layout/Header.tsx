import React from "react";
import logoImg from "../../assets/logo.jpg";
import { Link, useNavigate } from "react-router-dom";

import {
  Search,
  MessageCircle,
  User,
  PlusCircle,
  LogOut,
  BookOpen,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

export function Header() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            {/* Replace with your logo image URL */}
            <img
              src={logoImg}
              alt="UniSwap Logo"
              className="h-10 w-10 rounded-lg object-cover"
            />
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
                to="/post-tuition"
                className="bg-green-600 text-white hover:bg-green-700 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <PlusCircle className="h-4 w-4" />
                <span>Post Tuition</span>
              </Link>
              <Link
                to="/messages"
                className="text-gray-700 hover:text-blue-600 p-2 rounded-md transition-colors relative"
              >
                <MessageCircle className="h-5 w-5" />
                {/* Notification badge */}
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  2
                </span>
              </Link>
              <div className="relative">
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 p-2 rounded-md transition-colors"
                >
                  {user.profile_picture ? (
                    <img
                      src={user.profile_picture}
                      alt={user.username}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">
                        {user.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </Link>
              </div>
              <button
                onClick={handleSignOut}
                className="text-gray-700 hover:text-red-600 px-3 py-2 rounded-md transition-colors flex items-center space-x-2"
              >
                <LogOut className="h-5 w-5" />
                <span className="text-sm font-medium">Log out</span>
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
