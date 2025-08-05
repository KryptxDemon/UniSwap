import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  MapPin,
  Calendar,
  Edit3,
  MessageCircle,
  Package,
  Star,
} from "lucide-react";
import { demoUsers, demoItems, currentUser } from "../lib/demoData";
import { ItemCard } from "../components/Items/ItemCard";

export function ProfilePage() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<"active" | "exchanged">("active");

  // If no ID provided, show current user's profile
  const profileUser = id
    ? demoUsers.find((user) => user.id === id)
    : currentUser;
  const isOwnProfile = !id || id === currentUser.id;

  if (!profileUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            User Not Found
          </h2>
          <p className="text-gray-600">
            The user profile you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  // Get user's items
  const userItems = demoItems.filter((item) => item.user_id === profileUser.id);
  const activeItems = userItems.filter((item) => !item.is_exchanged);
  const exchangedItems = userItems.filter((item) => item.is_exchanged);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
  };

  const stats = [
    { label: "Items Listed", value: userItems.length },
    { label: "Active Listings", value: activeItems.length },
    { label: "Successful Exchanges", value: exchangedItems.length },
    { label: "Member Since", value: formatDate(profileUser.created_at) },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-3xl font-bold text-white">
                  {profileUser.username.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {profileUser.username}
                  </h1>
                  <p className="text-gray-600 flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>Joined {formatDate(profileUser.created_at)}</span>
                  </p>
                </div>

                <div className="flex space-x-3 mt-4 sm:mt-0">
                  {isOwnProfile ? (
                    <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                      <Edit3 className="h-4 w-4" />
                      <span>Edit Profile</span>
                    </button>
                  ) : (
                    <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                      <MessageCircle className="h-4 w-4" />
                      <span>Send Message</span>
                    </button>
                  )}
                </div>
              </div>

              {profileUser.bio && (
                <p className="text-gray-700 mb-4">{profileUser.bio}</p>
              )}

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="text-center p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="text-2xl font-bold text-blue-600 mb-1">
                      {typeof stat.value === "number" ? stat.value : stat.value}
                    </div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Listings Section */}
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {isOwnProfile
                ? "My Listings"
                : `${profileUser.username}'s Listings`}
            </h2>

            {/* Tab Navigation */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setActiveTab("active")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "active"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Active ({activeItems.length})
              </button>
              <button
                onClick={() => setActiveTab("exchanged")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "exchanged"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Exchanged ({exchangedItems.length})
              </button>
            </div>
          </div>

          {/* Items Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {(activeTab === "active" ? activeItems : exchangedItems).map(
              (item) => (
                <div key={item.id} className="relative">
                  <ItemCard item={item} />
                  {activeTab === "exchanged" && (
                    <div className="absolute inset-0 bg-gray-900 bg-opacity-50 rounded-xl flex items-center justify-center">
                      <div className="bg-green-500 text-white px-4 py-2 rounded-lg font-semibold flex items-center space-x-2">
                        <Star className="h-4 w-4" />
                        <span>Exchanged</span>
                      </div>
                    </div>
                  )}
                </div>
              )
            )}
          </div>

          {/* Empty State */}
          {(activeTab === "active" ? activeItems : exchangedItems).length ===
            0 && (
            <div className="text-center py-12">
              <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No {activeTab} items
              </h3>
              <p className="text-gray-600 mb-6">
                {activeTab === "active"
                  ? isOwnProfile
                    ? "You haven't posted any items yet."
                    : `${profileUser.username} hasn't posted any items yet.`
                  : isOwnProfile
                  ? "You haven't completed any exchanges yet."
                  : `${profileUser.username} hasn't completed any exchanges yet.`}
              </p>
              {isOwnProfile && activeTab === "active" && (
                <Link
                  to="/post-item"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
                >
                  <Package className="h-5 w-5" />
                  <span>Post Your First Item</span>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
