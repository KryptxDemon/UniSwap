import { useState, useEffect } from "react";
import logoImg from "../../assets/logo.jpg";
import { Link, useNavigate } from "react-router-dom";

import { MessageCircle, PlusCircle, LogOut, Moon, Sun } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../hooks/useTheme";
import { getProfilePictureUrl } from "../../utils/imageUtils";
import { messageAPI } from "../../services/apiService";

export function Header() {
  const { user, signOut } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  // Load unread message count
  useEffect(() => {
    const loadUnreadCount = async () => {
      if (user?.userId) {
        try {
          const conversations = await messageAPI.getUserConversations(
            user.userId
          );
          const totalUnread = conversations.reduce(
            (sum: number, conv: any) => sum + (conv.unreadCount || 0),
            0
          );
          setUnreadCount(totalUnread);
        } catch (error) {
          console.error("Error loading unread count:", error);
          setUnreadCount(0);
        }
      } else {
        setUnreadCount(0);
      }
    };

    loadUnreadCount();

    // Refresh unread count every 30 seconds
    const interval = setInterval(loadUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [user?.userId]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to={user ? "/browse" : "/"}
            className="flex items-center space-x-2 group"
          >
            {/* Replace with your logo image URL */}
            <img
              src={logoImg}
              alt="UniSwap Logo"
              className="h-10 w-10 rounded-lg object-cover"
            />
            <span className="text-2xl font-bold text-gray-900 dark:text-white transition-colors">
              UniSwap
            </span>
          </Link>

          {/* Navigation */}
          {user ? (
            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="text-gray-700 dark:text-gray-300 hover:text-pine-green dark:hover:text-bright-cyan p-2 rounded-md transition-colors"
                title={isDark ? "Switch to light mode" : "Switch to dark mode"}
              >
                {isDark ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </button>

              <Link
                to="/browse"
                className="text-gray-700 dark:text-gray-300 hover:text-pine-green dark:hover:text-bright-cyan px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Browse
              </Link>
              <Link
                to="/post-item"
                className="bg-pine-green text-white hover:bg-dark-teal dark:bg-bright-cyan dark:hover:bg-pine-green px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <PlusCircle className="h-4 w-4" />
                <span>Post Item</span>
              </Link>
              <Link
                to="/post-tuition"
                className="bg-bright-cyan text-white hover:bg-pine-green dark:bg-pine-green dark:hover:bg-bright-cyan px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <PlusCircle className="h-4 w-4" />
                <span>Post Tuition</span>
              </Link>
              <Link
                to="/messages"
                className="text-gray-700 dark:text-gray-300 hover:text-pine-green dark:hover:text-bright-cyan p-2 rounded-md transition-colors relative"
              >
                <MessageCircle className="h-5 w-5" />
                {/* Unread message badge */}
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-burnt-sienna text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </Link>
              <div className="relative">
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-pine-green dark:hover:text-bright-cyan p-2 rounded-md transition-colors"
                >
                  {user.profilePicture ? (
                    <img
                      key={user.profilePicture} // Force re-render when profile picture changes
                      src={getProfilePictureUrl(user.profilePicture)}
                      alt={user.username}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gradient-to-br from-pine-green to-bright-cyan rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">
                        {user.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </Link>
              </div>
              <button
                onClick={handleSignOut}
                className="text-gray-700 dark:text-gray-300 hover:text-burnt-sienna dark:hover:text-red-400 px-3 py-2 rounded-md transition-colors flex items-center space-x-2"
              >
                <LogOut className="h-5 w-5" />
                <span className="text-sm font-medium">Log out</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              {/* Theme Toggle for non-logged users */}
              <button
                onClick={toggleTheme}
                className="text-gray-700 dark:text-gray-300 hover:text-pine-green dark:hover:text-bright-cyan p-2 rounded-md transition-colors"
                title={isDark ? "Switch to light mode" : "Switch to dark mode"}
              >
                {isDark ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </button>

              <Link
                to="/browse"
                className="text-gray-700 dark:text-gray-300 hover:text-pine-green dark:hover:text-bright-cyan px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Browse
              </Link>
              <Link
                to="/login"
                className="text-gray-700 dark:text-gray-300 hover:text-pine-green dark:hover:text-bright-cyan px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-pine-green text-white hover:bg-dark-teal dark:bg-bright-cyan dark:hover:bg-pine-green px-4 py-2 rounded-lg text-sm font-medium transition-colors"
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
