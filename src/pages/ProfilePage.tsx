import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"active" | "exchanged">("active");

  const profileUser = id
    ? demoUsers.find((user) => user.id === id)
    : currentUser;
  const isOwnProfile = !id || id === currentUser.id;

  const [profilePic, setProfilePic] = useState(profileUser.profile_picture);

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfilePic(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!profileUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
            User Not Found
          </h2>
          <p className="text-gray-600 text-lg">
            The user profile you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  const userItems = demoItems.filter((item) => item.user_id === profileUser.id);
  const activeItems = userItems.filter((item) => !item.is_exchanged);
  const exchangedItems = userItems.filter((item) => item.is_exchanged);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });

  const stats = [
    { label: "Items Listed", value: userItems.length },
    { label: "Active Listings", value: activeItems.length },
    { label: "Successful Exchanges", value: exchangedItems.length },
    { label: "Member Since", value: formatDate(profileUser.created_at) },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white rounded-3xl shadow-lg p-10 mb-10 flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="relative flex-shrink-0">
            <img
              src={profilePic}
              alt="Profile"
              className="w-28 h-28 rounded-full border-8 border-blue-600 object-cover shadow-md"
            />
            {isOwnProfile && (
              <label className="absolute bottom-1 right-1 bg-blue-600 text-white rounded-full p-3 cursor-pointer hover:bg-blue-700 transition shadow-lg">
                <Edit3 className="h-5 w-5" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleProfilePicChange}
                />
              </label>
            )}
          </div>

          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-4xl font-extrabold text-gray-900">
                  {profileUser.username}
                </h1>
                <p className="text-gray-600 mt-1 flex items-center space-x-2 text-lg">
                  <Calendar className="h-5 w-5" />
                  <span>Joined {formatDate(profileUser.created_at)}</span>
                </p>
              </div>

              <div>
                {isOwnProfile ? (
                  <button
                    onClick={() => navigate(`/profile/${profileUser.id}/edit`)}
                    className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition flex items-center space-x-3 shadow-md"
                  >
                    <Edit3 className="h-5 w-5" />
                    <span className="text-lg font-semibold">Edit Profile</span>
                  </button>
                ) : (
                  <button className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition flex items-center space-x-3 shadow-md">
                    <MessageCircle className="h-5 w-5" />
                    <span className="text-lg font-semibold">Send Message</span>
                  </button>
                )}
              </div>
            </div>

            {profileUser.bio && (
              <p className="text-gray-700 mt-6 max-w-xl leading-relaxed text-lg">
                {profileUser.bio}
              </p>
            )}

            {/* Stats */}
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
              {stats.map((stat, i) => (
                <div
                  key={i}
                  className="bg-gray-100 rounded-2xl p-6 shadow-inner"
                >
                  <div className="text-3xl font-extrabold text-blue-600 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm font-medium text-gray-600 tracking-wide">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Listings Section */}
        <div className="bg-white rounded-3xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900">
              {isOwnProfile
                ? "My Listings"
                : `${profileUser.username}'s Listings`}
            </h2>

            <div className="flex bg-gray-200 rounded-xl p-1 shadow-inner">
              <button
                onClick={() => setActiveTab("active")}
                className={`px-6 py-3 rounded-xl text-lg font-semibold transition-colors ${
                  activeTab === "active"
                    ? "bg-white text-blue-600 shadow-lg"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Active ({activeItems.length})
              </button>
              <button
                onClick={() => setActiveTab("exchanged")}
                className={`px-6 py-3 rounded-xl text-lg font-semibold transition-colors ${
                  activeTab === "exchanged"
                    ? "bg-white text-blue-600 shadow-lg"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Exchanged ({exchangedItems.length})
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {(activeTab === "active" ? activeItems : exchangedItems).map(
              (item) => (
                <div
                  key={item.id}
                  className="relative group rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
                >
                  <ItemCard item={item} />
                  {activeTab === "exchanged" && (
                    <div className="absolute inset-0 bg-black bg-opacity-40 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-green-500 text-white px-5 py-2 rounded-full font-semibold flex items-center space-x-2 shadow-lg">
                        <Star className="h-5 w-5" />
                        <span>Exchanged</span>
                      </div>
                    </div>
                  )}
                </div>
              )
            )}
          </div>

          {(activeTab === "active" ? activeItems : exchangedItems).length ===
            0 && (
            <div className="text-center py-20">
              <Package className="h-20 w-20 text-gray-400 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                No {activeTab} items
              </h3>
              <p className="text-gray-600 text-lg mb-8 max-w-xl mx-auto">
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
                  className="bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-700 transition inline-flex items-center space-x-3 shadow-md"
                >
                  <Package className="h-6 w-6" />
                  <span className="text-lg font-semibold">
                    Post Your First Item
                  </span>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
