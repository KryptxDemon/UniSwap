import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  MapPin,
  Calendar,
  Edit3,
  MessageCircle,
  Package,
  Star,
  Heart,
  BookOpen,
  Trash2,
} from "lucide-react";
import { demoUsers, demoItems, currentUser } from "../lib/demoData";
import { ItemCard } from "../components/Items/ItemCard";

export function ProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"active" | "exchanged" | "wishlist">("active");

  const profileUser = id
    ? demoUsers.find((user) => user.id === id)
    : currentUser;
  const isOwnProfile = !id || id === currentUser.id;

  const [profilePic, setProfilePic] = useState(profileUser?.profile_picture || '/default-avatar.png');

  // Get wishlist data from localStorage
  const [wishlist, setWishlist] = useState<{ [key: string]: { note: string; createdAt: string } }>(() => {
    const stored = localStorage.getItem("wishlist");
    return stored ? JSON.parse(stored) : {};
  });

  const [tuitionWishlist, setTuitionWishlist] = useState<{ [key: string]: { note: string; createdAt: string } }>(() => {
    const stored = localStorage.getItem("tuitionWishlist");
    return stored ? JSON.parse(stored) : {};
  });

  const removeFromWishlist = (itemId: string, type: 'item' | 'tuition') => {
    if (type === 'item') {
      const updated = { ...wishlist };
      delete updated[itemId];
      setWishlist(updated);
      localStorage.setItem("wishlist", JSON.stringify(updated));
    } else {
      const updated = { ...tuitionWishlist };
      delete updated[itemId];
      setTuitionWishlist(updated);
      localStorage.setItem("tuitionWishlist", JSON.stringify(updated));
    }
  };
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

  // Get wishlisted items
  const wishlistedItems = demoItems.filter(item => wishlist[item.id]);
  const wishlistedTuitions = []; // Add tuition data when available

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });

  const formatWishlistDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  const stats = [
    { label: "Items Listed", value: userItems.length },
    { label: "Active Listings", value: activeItems.length },
    { label: "Successful Exchanges", value: exchangedItems.length },
    { label: "Wishlist Items", value: Object.keys(wishlist).length + Object.keys(tuitionWishlist).length },
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
              className="w-28 h-28 rounded-full border-8 border-pine-green object-cover shadow-md"
            />
            {isOwnProfile && (
              <label className="absolute bottom-1 right-1 bg-pine-green text-white rounded-full p-3 cursor-pointer hover:bg-dark-teal transition shadow-lg">
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
                    className="bg-pine-green text-white px-8 py-3 rounded-xl hover:bg-dark-teal transition flex items-center space-x-3 shadow-md"
                  >
                    <Edit3 className="h-5 w-5" />
                    <span className="text-lg font-semibold">Edit Profile</span>
                  </button>
                ) : (
                  <button className="bg-pine-green text-white px-8 py-3 rounded-xl hover:bg-dark-teal transition flex items-center space-x-3 shadow-md">
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
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
              {stats.map((stat, i) => (
                <div
                  key={i}
                  className="bg-gray-100 rounded-2xl p-6 shadow-inner"
                >
                  <div className="text-3xl font-extrabold text-pine-green mb-1">
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
                    ? "bg-white text-pine-green shadow-lg"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Active ({activeItems.length})
              </button>
              <button
                onClick={() => setActiveTab("exchanged")}
                className={`px-6 py-3 rounded-xl text-lg font-semibold transition-colors ${
                  activeTab === "exchanged"
                    ? "bg-white text-pine-green shadow-lg"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Exchanged ({exchangedItems.length})
              </button>
              {isOwnProfile && (
                <button
                  onClick={() => setActiveTab("wishlist")}
                  className={`px-6 py-3 rounded-xl text-lg font-semibold transition-colors ${
                    activeTab === "wishlist"
                      ? "bg-white text-pine-green shadow-lg"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Wishlist ({Object.keys(wishlist).length + Object.keys(tuitionWishlist).length})
                </button>
              )}
            </div>
          </div>

          {activeTab === "wishlist" && isOwnProfile ? (
            <div className="space-y-6">
              {Object.keys(wishlist).length === 0 && Object.keys(tuitionWishlist).length === 0 ? (
                <div className="text-center py-20">
                  <Heart className="h-20 w-20 text-gray-400 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    No saved items
                  </h3>
                  <p className="text-gray-600 text-lg mb-8 max-w-xl mx-auto">
                    Items you save will appear here. Start browsing to find items you're interested in!
                  </p>
                  <Link
                    to="/browse"
                    className="bg-pine-green text-white px-8 py-4 rounded-xl hover:bg-dark-teal transition inline-flex items-center space-x-3 shadow-md"
                  >
                    <Package className="h-6 w-6" />
                    <span className="text-lg font-semibold">Browse Items</span>
                  </Link>
                </div>
              ) : (
                <>
                  {/* Wishlisted Items */}
                  {Object.keys(wishlist).length > 0 && (
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                        <Package className="h-6 w-6" />
                        <span>Saved Items ({Object.keys(wishlist).length})</span>
                      </h3>
                      <div className="space-y-4">
                        {wishlistedItems.map((item) => (
                          <div key={item.id} className="bg-gray-50 rounded-xl p-6 flex items-start space-x-4">
                            <div className="flex-shrink-0">
                              {item.images && item.images.length > 0 ? (
                                <img
                                  src={item.images[0]}
                                  alt={item.title}
                                  className="w-20 h-20 object-cover rounded-lg"
                                />
                              ) : (
                                <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                                  <Package className="h-8 w-8 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between">
                                <div>
                                  <Link
                                    to={`/item/${item.id}`}
                                    className="text-lg font-semibold text-gray-900 hover:text-pine-green transition-colors"
                                  >
                                    {item.title}
                                  </Link>
                                  <p className="text-gray-600 mt-1">{item.description.substring(0, 100)}...</p>
                                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                                    <span>Saved on {formatWishlistDate(wishlist[item.id]?.createdAt || new Date().toISOString())}</span>
                                    <span>•</span>
                                    <span>{item.location.name}</span>
                                  </div>
                                  {wishlist[item.id]?.note && (
                                    <div className="mt-3 bg-blue-50 border-l-4 border-blue-400 p-3 rounded">
                                      <p className="text-pine-green text-sm">
                                        <span className="font-medium">Note:</span> {wishlist[item.id].note}
                                      </p>
                                    </div>
                                  )}
                                </div>
                                <button
                                  onClick={() => removeFromWishlist(item.id, 'item')}
                                  className="text-burnt-sienna hover:text-burnt-sienna/80 p-2 rounded-full hover:bg-burnt-sienna/10 transition-colors"
                                >
                                  <Trash2 className="h-5 w-5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Wishlisted Tuitions */}
                  {Object.keys(tuitionWishlist).length > 0 && (
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                        <BookOpen className="h-6 w-6" />
                        <span>Saved Tuitions ({Object.keys(tuitionWishlist).length})</span>
                      </h3>
                      <div className="space-y-4">
                        {Object.keys(tuitionWishlist).map((tuitionId) => (
                          <div key={tuitionId} className="bg-gray-50 rounded-xl p-6 flex items-start justify-between">
                            <div className="flex-1">
                              <div className="text-lg font-semibold text-gray-900">Tuition #{tuitionId}</div>
                              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                                <span>Saved on {formatWishlistDate(tuitionWishlist[tuitionId]?.createdAt || new Date().toISOString())}</span>
                              </div>
                              {tuitionWishlist[tuitionId]?.note && (
                                <div className="mt-3 bg-powder-blue border-l-4 border-bright-cyan p-3 rounded">
                                  <p className="text-pine-green text-sm">
                                    <span className="font-medium">Note:</span> {tuitionWishlist[tuitionId].note}
                                  </p>
                                </div>
                              )}
                            </div>
                            <button
                              onClick={() => removeFromWishlist(tuitionId, 'tuition')}
                              className="text-burnt-sienna hover:text-burnt-sienna/80 p-2 rounded-full hover:bg-burnt-sienna/10 transition-colors"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          ) : (
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
          )}

          {activeTab !== "wishlist" && (activeTab === "active" ? activeItems : exchangedItems).length === 0 && (
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
