import logoImg from "../../assets/logo.jpg";
import { Link, useNavigate } from "react-router-dom";

import { MessageCircle, PlusCircle, LogOut } from "lucide-react";
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
            <span className="text-2xl font-bold text-gray-900">UniSwap</span>
          </Link>

          {/* Navigation */}
          {user ? (
            <div className="flex items-center space-x-4">
              <Link
                to="/browse"
                className="text-gray-700 hover:text-pine-green px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Browse
              </Link>
              <Link
                to="/post-item"
                className="bg-pine-green text-white hover:bg-dark-teal px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <PlusCircle className="h-4 w-4" />
                <span>Post Item</span>
              </Link>
              <Link
                to="/post-tuition"
                className="bg-bright-cyan text-white hover:bg-pine-green px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <PlusCircle className="h-4 w-4" />
                <span>Post Tuition</span>
              </Link>
              <Link
                to="/messages"
                className="text-gray-700 hover:text-pine-green p-2 rounded-md transition-colors relative"
              >
                <MessageCircle className="h-5 w-5" />
                {/* Notification badge */}
                {(() => {
                  try {
                    const conversations = JSON.parse(
                      localStorage.getItem("conversations") || "[]"
                    );
                    const messages = JSON.parse(
                      localStorage.getItem("messages") || "[]"
                    );

                    // Count unread conversations (conversations with messages not from current user)
                    const unreadCount = conversations.filter((conv: any) => {
                      const convMessages = messages.filter(
                        (msg: any) => msg.conversation_id === conv.id
                      );
                      return convMessages.some(
                        (msg: any) =>
                          msg.sender_id !== user?.userId && !msg.read
                      );
                    }).length;

                    return unreadCount > 0 ? (
                      <span className="absolute -top-1 -right-1 bg-burnt-sienna text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </span>
                    ) : null;
                  } catch {
                    return null;
                  }
                })()}
              </Link>
              <div className="relative">
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 text-gray-700 hover:text-pine-green p-2 rounded-md transition-colors"
                >
                  {user.profilePicture ? (
                    <img
                      key={user.profilePicture} // Force re-render when profile picture changes
                      src={user.profilePicture}
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
                className="text-gray-700 hover:text-burnt-sienna px-3 py-2 rounded-md transition-colors flex items-center space-x-2"
              >
                <LogOut className="h-5 w-5" />
                <span className="text-sm font-medium">Log out</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link
                to="/browse"
                className="text-gray-700 hover:text-pine-green px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Browse
              </Link>
              <Link
                to="/login"
                className="text-gray-700 hover:text-pine-green px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-pine-green text-white hover:bg-dark-teal px-4 py-2 rounded-lg text-sm font-medium transition-colors"
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
