import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Calendar,
  Edit3,
  MessageCircle,
  Package,
  Star,
  Heart,
  BookOpen,
  Trash2,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { ItemCard } from "../components/Items/ItemCard";
import { userAPI, itemAPI, wishlistAPI } from "../services/apiService";

export function ProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<
    "active" | "exchanged" | "wishlist"
  >("active");
  const { user: authUser, updateProfile } = useAuth();

  // State for profile user data
  const [profileUser, setProfileUser] = useState<any>(null);
  const [profilePic, setProfilePic] = useState("/default-avatar.png");

  const isOwnProfile = !!authUser && (!id || id === authUser.userId.toString());

  // State for API data
  const [userItems, setUserItems] = useState<any[]>([]);
  const [wishlistedItems, setWishlistedItems] = useState<any[]>([]);
  const [wishlistedTuitions, setWishlistedTuitions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch profile user data
  useEffect(() => {
    const fetchProfileUser = async () => {
      try {
        if (!id) {
          // Viewing own profile, use authUser
          if (authUser) {
            setProfileUser(authUser);
            setProfilePic(authUser.profilePicture || "/default-avatar.png");
          }
        } else {
          // Viewing another user's profile, fetch from backend
          const user = await userAPI.getUserById(Number(id));
          setProfileUser(user);
          setProfilePic(user.profilePicture || "/default-avatar.png");
        }
      } catch (err) {
        console.error("Error fetching profile user:", err);
        setError("Failed to load user profile");
      }
    };

    if (!id && authUser) {
      // Own profile
      setProfileUser(authUser);
      setProfilePic(authUser.profilePicture || "/default-avatar.png");
    } else if (id) {
      // Another user's profile
      fetchProfileUser();
    }
  }, [id, authUser]);

  // Fetch user data from API
  useEffect(() => {
    const fetchUserData = async () => {
      if (!profileUser) return;

      try {
        setLoading(true);
        setError(null);

        // Fetch user's items
        const items = await itemAPI.getUserItems(Number(profileUser.userId));
        setUserItems(items);

        // If viewing own profile, fetch wishlist data and borrow records
        if (isOwnProfile && authUser) {
          const wishlists = await wishlistAPI.getUserWishlists(
            Number(authUser.userId)
          );

          // Extract items and tuitions from wishlists
          const itemWishlists = wishlists.filter(
            (w: any) => Array.isArray(w.items) && w.items.length > 0
          );
          const tuitionWishlists = wishlists.filter(
            (w: any) => w.tuitions && w.tuitions.length > 0
          );

          // Flatten the items and tuitions
          const items = itemWishlists.flatMap((w: any) =>
            w.items.map((item: any) => ({
              ...item,
              wishlistNote: w.notes,
              wishlistCreatedAt: w.createdDate,
            }))
          );

          const tuitions = tuitionWishlists.flatMap(
            (w: any) =>
              w.tuitions?.map((tuition: any) => ({
                ...tuition,
                wishlistNote: w.notes,
                wishlistCreatedAt: w.createdDate,
              })) || []
          );

          setWishlistedItems(items);
          setWishlistedTuitions(tuitions);
        }
      } catch (err) {
        setError("Failed to load profile data");
        console.error("Error fetching profile data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (profileUser) {
      fetchUserData();
    }
  }, [profileUser, authUser, isOwnProfile]);

  const removeFromWishlist = async (
    itemId: string,
    type: "item" | "tuition"
  ) => {
    if (!authUser) return;

    try {
      await wishlistAPI.removeFromWishlist(
        Number(authUser.userId),
        Number(itemId)
      );

      // Update local state
      if (type === "item") {
        setWishlistedItems((prev) =>
          prev.filter((item) => item.itemId !== Number(itemId))
        );
      } else {
        setWishlistedTuitions((prev) =>
          prev.filter((tuition) => tuition.tuitionId !== Number(itemId))
        );
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      alert("Failed to remove from wishlist. Please try again.");
    }
  };
  const handleProfilePicChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file && authUser) {
      const reader = new FileReader();
      reader.onload = async () => {
        const url = reader.result as string;
        setProfilePic(url);
        updateProfile({ profilePicture: url });

        // Also update in backend
        try {
          await userAPI.updateUser(Number(authUser.userId), {
            ...profileUser,
            profilePicture: url,
          });
        } catch (error) {
          console.error("Error updating profile picture in backend:", error);
        }
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

  const activeItems = userItems.filter((item) => item.status !== "exchanged");
  const exchangedItems = userItems.filter(
    (item) => item.status === "exchanged"
  );

  // Loading and error states
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

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
    {
      label: "Wishlist Items",
      value: wishlistedItems.length + wishlistedTuitions.length,
    },
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
                  <span>Student ID: {profileUser.studentId}</span>
                </p>
              </div>

              <div>
                {isOwnProfile ? (
                  <button
                    onClick={() =>
                      navigate(`/profile/${profileUser.userId}/edit`)
                    }
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
                  Wishlist ({wishlistedItems.length + wishlistedTuitions.length}
                  )
                </button>
              )}
            </div>
          </div>

          {activeTab === "wishlist" && isOwnProfile ? (
            <div className="space-y-6">
              {wishlistedItems.length === 0 &&
              wishlistedTuitions.length === 0 ? (
                <div className="text-center py-20">
                  <Heart className="h-20 w-20 text-gray-400 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    No saved items
                  </h3>
                  <p className="text-gray-600 text-lg mb-8 max-w-xl mx-auto">
                    Items you save will appear here. Start browsing to find
                    items you're interested in!
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
                  {wishlistedItems.length > 0 && (
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                        <Package className="h-6 w-6" />
                        <span>Saved Items ({wishlistedItems.length})</span>
                      </h3>
                      <div className="space-y-4">
                        {wishlistedItems.map((item) => (
                          <div
                            key={item.id}
                            className="bg-gray-50 rounded-xl p-6 flex items-start space-x-4"
                          >
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
                                    to={`/item/${item.itemId}`}
                                    className="text-lg font-semibold text-gray-900 hover:text-pine-green transition-colors"
                                  >
                                    {item.itemName}
                                  </Link>
                                  <p className="text-gray-600 mt-1">
                                    {item.description?.substring(0, 100) ||
                                      "No description"}
                                    ...
                                  </p>
                                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                                    <span>
                                      Saved on{" "}
                                      {formatWishlistDate(
                                        item.wishlistCreatedAt ||
                                          new Date().toISOString()
                                      )}
                                    </span>
                                    <span>•</span>
                                    <span>
                                      {item.location?.locationName ||
                                        "Unknown location"}
                                    </span>
                                  </div>
                                  {item.wishlistNote && (
                                    <div className="mt-3 bg-blue-50 border-l-4 border-blue-400 p-3 rounded">
                                      <p className="text-pine-green text-sm">
                                        <span className="font-medium">
                                          Note:
                                        </span>{" "}
                                        {item.wishlistNote}
                                      </p>
                                    </div>
                                  )}
                                </div>
                                <button
                                  onClick={() =>
                                    removeFromWishlist(
                                      item.itemId.toString(),
                                      "item"
                                    )
                                  }
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
                  {wishlistedTuitions.length > 0 && (
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                        <BookOpen className="h-6 w-6" />
                        <span>
                          Saved Tuitions ({wishlistedTuitions.length})
                        </span>
                      </h3>
                      <div className="space-y-4">
                        {wishlistedTuitions.map((tuition) => (
                          <div
                            key={tuition.tuitionId}
                            className="bg-gray-50 rounded-xl p-6 flex items-start justify-between"
                          >
                            <div className="flex-1">
                              <Link
                                to={`/tuition/${tuition.tuitionId}`}
                                className="text-lg font-semibold text-gray-900 hover:text-pine-green transition-colors"
                              >
                                {tuition.subject} Tuition
                              </Link>
                              <p className="text-gray-600 mt-1">
                                Class: {tuition.clazz} • Salary: ৳
                                {tuition.salary}
                              </p>
                              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                                <span>
                                  Saved on{" "}
                                  {formatWishlistDate(
                                    tuition.wishlistCreatedAt ||
                                      new Date().toISOString()
                                  )}
                                </span>
                              </div>
                              {tuition.wishlistNote && (
                                <div className="mt-3 bg-powder-blue border-l-4 border-bright-cyan p-3 rounded">
                                  <p className="text-pine-green text-sm">
                                    <span className="font-medium">Note:</span>{" "}
                                    {tuition.wishlistNote}
                                  </p>
                                </div>
                              )}
                            </div>
                            <button
                              onClick={() =>
                                removeFromWishlist(
                                  tuition.tuitionId.toString(),
                                  "tuition"
                                )
                              }
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

          {activeTab !== "wishlist" &&
            (activeTab === "active" ? activeItems : exchangedItems).length ===
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
