import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Edit3,
  MessageCircle,
  Package,
  Heart,
  Trash2,
  Settings,
  User,
  Mail,
  CreditCard,
  Lock,
  AlertTriangle,
  Eye,
  EyeOff,
  X,
  BookOpen,
  Star,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { ItemCard } from "../components/Items/ItemCard";
import { TuitionCard } from "../components/Tuition/TuitionCard";
import { AvatarPicker } from "../components/Profile/AvatarPicker";
import {
  userAPI,
  itemAPI,
  wishlistAPI,
  tuitionAPI,
} from "../services/apiService";
import { getProfilePictureUrl } from "../utils/imageUtils";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPasswordChange: (oldPassword: string, newPassword: string) => Promise<void>;
  onAccountDeletion: (reason: string) => Promise<void>;
}

function SettingsModal({
  isOpen,
  onClose,
  onPasswordChange,
  onAccountDeletion,
}: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<"password" | "account">(
    "password"
  );
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [deleteReason, setDeleteReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await onPasswordChange(oldPassword, newPassword);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      alert("Password changed successfully!");
    } catch (err: any) {
      setError(err.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  const handleAccountDeletion = async () => {
    if (!deleteReason.trim()) {
      setError("Please provide a reason for account deletion");
      return;
    }

    if (
      !confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      return;
    }

    setLoading(true);
    setError("");
    try {
      await onAccountDeletion(deleteReason);
      alert("Account deletion request sent to admin");
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to submit deletion request");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Account Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab("password")}
            className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
              activeTab === "password"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Lock className="h-4 w-4 inline mr-2" />
            Change Password
          </button>
          <button
            onClick={() => setActiveTab("account")}
            className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
              activeTab === "account"
                ? "bg-white text-red-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Trash2 className="h-4 w-4 inline mr-2" />
            Delete Account
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        {activeTab === "password" && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords ? "text" : "password"}
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords(!showPasswords)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  {showPasswords ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <input
                type={showPasswords ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password
              </label>
              <input
                type={showPasswords ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                required
              />
            </div>

            <button
              onClick={handlePasswordChange}
              disabled={
                loading || !oldPassword || !newPassword || !confirmPassword
              }
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Changing..." : "Change Password"}
            </button>
          </div>
        )}

        {activeTab === "account" && (
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
                <div className="text-sm text-red-800">
                  <strong>Warning:</strong> Account deletion is permanent and
                  cannot be undone. All your listings, messages, and data will
                  be lost.
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for account deletion *
              </label>
              <textarea
                value={deleteReason}
                onChange={(e) => setDeleteReason(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 h-24"
                placeholder="Please tell us why you want to delete your account..."
                required
              />
            </div>

            <button
              onClick={handleAccountDeletion}
              disabled={loading || !deleteReason.trim()}
              className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Request Account Deletion"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

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
  const [showSettings, setShowSettings] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  const isOwnProfile = !!authUser && (!id || id === authUser.userId.toString());

  // State for API data
  const [userItems, setUserItems] = useState<any[]>([]);
  const [userTuitions, setUserTuitions] = useState<any[]>([]);
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
            console.log("Auth user data:", authUser); // Debug log
            setProfileUser(authUser);
            setProfilePic(getProfilePictureUrl(authUser.profilePicture));
          }
        } else {
          // Viewing another user's profile, fetch from backend
          const user = await userAPI.getUserById(Number(id));
          console.log("Fetched user data:", user); // Debug log
          setProfileUser(user);
          setProfilePic(getProfilePictureUrl(user.profilePicture));
        }
      } catch (err) {
        console.error("Error fetching profile user:", err);
        setError("Failed to load user profile");
      }
    };

    if (!id && authUser) {
      // Own profile
      setProfileUser(authUser);
      setProfilePic(getProfilePictureUrl(authUser.profilePicture));
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

        // Fetch user's tuitions
        const tuitions = await tuitionAPI.getUserTuitions(
          Number(profileUser.userId)
        );
        console.log("Fetched tuitions:", tuitions);
        setUserTuitions(tuitions);

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

  // Tuition Management Functions
  const deleteTuition = async (tuitionId: number) => {
    if (!authUser || !isOwnProfile) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this tuition? This action cannot be undone."
    );
    if (!confirmed) return;

    try {
      await tuitionAPI.deleteTuition(tuitionId);

      // Update local state by removing the deleted tuition
      setUserTuitions((prev) =>
        prev.filter((tuition) => tuition.tuitionId !== tuitionId)
      );

      alert("Tuition deleted successfully!");
    } catch (error) {
      console.error("Error deleting tuition:", error);
      alert("Failed to delete tuition. Please try again.");
    }
  };

  const markTuitionAsGiven = async (tuitionId: number) => {
    if (!authUser || !isOwnProfile) return;

    const confirmed = window.confirm("Mark this tuition as given/completed?");
    if (!confirmed) return;

    try {
      await tuitionAPI.markAsCompleted(tuitionId);

      // Update local state
      setUserTuitions((prev) =>
        prev.map((tuition) =>
          tuition.tuitionId === tuitionId
            ? { ...tuition, tStatus: "completed" }
            : tuition
        )
      );

      alert("Tuition marked as completed!");
    } catch (error) {
      console.error("Error marking tuition as completed:", error);
      alert("Failed to update tuition status. Please try again.");
    }
  };

  // Settings Modal Handlers
  const handlePasswordChange = async (
    oldPassword: string,
    newPassword: string
  ) => {
    if (!authUser) return;

    try {
      // Use the new API endpoint for password change
      const response = await fetch(
        `/api/users/${authUser.userId}/change-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Assuming you store JWT token
          },
          body: JSON.stringify({
            oldPassword,
            newPassword,
          }),
        }
      );

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
      }

      console.log("Password change requested for user:", authUser.userId);
    } catch (error) {
      console.error("Error changing password:", error);
      throw new Error("Failed to change password. Please try again.");
    }
  };

  const handleAccountDeletion = async (reason: string) => {
    if (!authUser) return;

    try {
      // Use the new API endpoint for account deletion request
      const response = await fetch(
        `/api/users/${authUser.userId}/request-deletion`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Assuming you store JWT token
          },
          body: JSON.stringify({
            reason,
          }),
        }
      );

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
      }

      console.log(
        "Account deletion requested for user:",
        authUser.userId,
        "Reason:",
        reason
      );
    } catch (error) {
      console.error("Error requesting account deletion:", error);
      throw new Error("Failed to submit deletion request. Please try again.");
    }
  };

  const handleAvatarSelect = async (avatarId: string) => {
    if (authUser && profileUser) {
      try {
        // Update user in backend with the selected avatar ID
        await userAPI.updateUser(Number(authUser.userId), {
          ...profileUser,
          profilePicture: avatarId,
        });

        // Update local state
        const avatarUrl = getProfilePictureUrl(avatarId);
        setProfilePic(avatarUrl);
        updateProfile({ profilePicture: avatarId });

        console.log("Avatar updated successfully");
      } catch (error) {
        console.error("Error updating avatar:", error);
        // Revert if update failed
        const fallbackUrl = getProfilePictureUrl(profileUser?.profilePicture);
        setProfilePic(fallbackUrl);
      }
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

  const activeItems = userItems.filter(
    (item) =>
      item.status !== "exchanged" &&
      item.status !== "donated" &&
      item.status !== "rented" &&
      !item.is_exchanged
  );

  const exchangedItems = userItems.filter(
    (item) =>
      item.status === "exchanged" ||
      item.status === "donated" ||
      item.status === "rented" ||
      item.is_exchanged === true
  );

  const activeTuitions = userTuitions.filter(
    (tuition) => tuition.tStatus === "available"
  );
  console.log("Active tuitions:", activeTuitions);

  const completedTuitions = userTuitions.filter(
    (tuition) => tuition.tStatus === "completed" || tuition.tStatus === "taken"
  );
  console.log("Completed tuitions:", completedTuitions);

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
    { label: "Tuitions Listed", value: userTuitions.length },
    {
      label: "Active Listings",
      value: activeItems.length + activeTuitions.length,
    },
    {
      label: "Completed",
      value: exchangedItems.length + completedTuitions.length,
    },
    {
      label: "Wishlist Items",
      value: wishlistedItems.length + wishlistedTuitions.length,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-10 mb-10 flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="relative flex-shrink-0">
            <img
              src={profilePic}
              alt="Profile"
              className="w-28 h-28 rounded-full border-8 border-pine-green object-cover shadow-md"
            />
            {isOwnProfile && (
              <button
                onClick={() => setShowAvatarPicker(true)}
                className="absolute bottom-1 right-1 bg-pine-green text-white rounded-full p-3 cursor-pointer hover:bg-dark-teal transition shadow-lg"
              >
                <Edit3 className="h-5 w-5" />
              </button>
            )}
          </div>

          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-4">
              <div className="flex-1">
                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100">
                  {profileUser.username}
                </h1>

                {/* Enhanced User Information */}
                <div className="mt-3 space-y-2">
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                    <Mail className="h-4 w-4" />
                    <span>{profileUser.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                    <CreditCard className="h-4 w-4" />
                    <span>
                      Student ID:{" "}
                      {profileUser.studentId &&
                      profileUser.studentId.trim() !== ""
                        ? profileUser.studentId
                        : "Not provided"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                    <User className="h-4 w-4" />
                    <span>Username: {profileUser.username}</span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                {isOwnProfile ? (
                  <>
                    <button
                      onClick={() => setShowSettings(true)}
                      className="bg-gray-600 text-white px-6 py-3 rounded-xl hover:bg-gray-700 transition flex items-center space-x-2 shadow-md"
                    >
                      <Settings className="h-5 w-5" />
                      <span className="font-semibold">Settings</span>
                    </button>
                    <button
                      onClick={() =>
                        navigate(`/profile/${profileUser.userId}/edit`)
                      }
                      className="bg-pine-green text-white px-6 py-3 rounded-xl hover:bg-dark-teal transition flex items-center space-x-2 shadow-md"
                    >
                      <Edit3 className="h-5 w-5" />
                      <span className="font-semibold">Edit Profile</span>
                    </button>
                  </>
                ) : (
                  <button className="bg-pine-green text-white px-8 py-3 rounded-xl hover:bg-dark-teal transition flex items-center space-x-3 shadow-md">
                    <MessageCircle className="h-5 w-5" />
                    <span className="text-lg font-semibold">Send Message</span>
                  </button>
                )}
              </div>
            </div>

            {profileUser.bio && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Bio
                </h3>
                <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">
                  {profileUser.bio}
                </p>
              </div>
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
                Active ({activeItems.length + activeTuitions.length})
              </button>
              <button
                onClick={() => setActiveTab("exchanged")}
                className={`px-6 py-3 rounded-xl text-lg font-semibold transition-colors ${
                  activeTab === "exchanged"
                    ? "bg-white text-pine-green shadow-lg"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Completed ({exchangedItems.length + completedTuitions.length})
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
                        {wishlistedItems.map((item) => {
                          const isUnavailable =
                            item.status === "exchanged" ||
                            item.status === "donated" ||
                            item.status === "rented" ||
                            item.is_exchanged === true;

                          return (
                            <div
                              key={item.id}
                              className={`bg-gray-50 rounded-xl p-6 flex items-start space-x-4 ${
                                isUnavailable ? "opacity-50 grayscale" : ""
                              }`}
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
                                      className={`text-lg font-semibold hover:text-pine-green transition-colors ${
                                        isUnavailable
                                          ? "text-gray-500"
                                          : "text-gray-900"
                                      }`}
                                    >
                                      {item.itemName}
                                      {isUnavailable && (
                                        <span className="ml-2 text-sm text-red-500 font-normal">
                                          (No longer available)
                                        </span>
                                      )}
                                    </Link>
                                    <p
                                      className={`mt-1 ${
                                        isUnavailable
                                          ? "text-gray-400"
                                          : "text-gray-600"
                                      }`}
                                    >
                                      {item.description?.substring(0, 100) ||
                                        "No description"}
                                      ...
                                    </p>
                                    <div
                                      className={`flex items-center space-x-4 mt-2 text-sm ${
                                        isUnavailable
                                          ? "text-gray-400"
                                          : "text-gray-500"
                                      }`}
                                    >
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
                                        <p
                                          className={`text-sm ${
                                            isUnavailable
                                              ? "text-gray-500"
                                              : "text-pine-green"
                                          }`}
                                        >
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
                          );
                        })}
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
                        {wishlistedTuitions.map((tuition) => {
                          const isUnavailable =
                            tuition.tStatus === "taken" ||
                            tuition.tStatus === "completed";

                          return (
                            <div
                              key={tuition.tuitionId}
                              className={`bg-gray-50 rounded-xl p-6 flex items-start justify-between ${
                                isUnavailable ? "opacity-50 grayscale" : ""
                              }`}
                            >
                              <div className="flex-1">
                                <Link
                                  to={`/tuition/${tuition.tuitionId}`}
                                  className={`text-lg font-semibold hover:text-pine-green transition-colors ${
                                    isUnavailable
                                      ? "text-gray-500"
                                      : "text-gray-900"
                                  }`}
                                >
                                  {tuition.subject} Tuition
                                  {isUnavailable && (
                                    <span className="ml-2 text-sm text-red-500 font-normal">
                                      (No longer available)
                                    </span>
                                  )}
                                </Link>
                                <p
                                  className={`mt-1 ${
                                    isUnavailable
                                      ? "text-gray-400"
                                      : "text-gray-600"
                                  }`}
                                >
                                  Class: {tuition.clazz} • Salary: ৳
                                  {tuition.salary}
                                </p>
                                <div
                                  className={`flex items-center space-x-4 mt-2 text-sm ${
                                    isUnavailable
                                      ? "text-gray-400"
                                      : "text-gray-500"
                                  }`}
                                >
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
                                    <p
                                      className={`text-sm ${
                                        isUnavailable
                                          ? "text-gray-500"
                                          : "text-pine-green"
                                      }`}
                                    >
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
                          );
                        })}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {/* Items */}
              {(activeTab === "active" ? activeItems : exchangedItems).map(
                (item) => (
                  <div
                    key={`item-${item.id}`}
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

              {/* Tuitions */}
              {(activeTab === "active"
                ? activeTuitions
                : completedTuitions
              ).map((tuition) => (
                <div
                  key={`tuition-${tuition.tuitionId}`}
                  className="relative group rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
                >
                  <TuitionCard tuition={tuition} />
                  {activeTab === "exchanged" && (
                    <div className="absolute inset-0 bg-black bg-opacity-40 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-green-500 text-white px-5 py-2 rounded-full font-semibold flex items-center space-x-2 shadow-lg">
                        <Star className="h-5 w-5" />
                        <span>Completed</span>
                      </div>
                    </div>
                  )}
                  {/* Management Actions for Active Tuitions (Own Profile Only) */}
                  {isOwnProfile && activeTab === "active" && (
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="flex space-x-2">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            markTuitionAsGiven(tuition.tuitionId);
                          }}
                          className="bg-green-600 text-white p-2 rounded-full hover:bg-green-700 transition shadow-lg"
                          title="Mark as Given"
                        >
                          <Star className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            deleteTuition(tuition.tuitionId);
                          }}
                          className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition shadow-lg"
                          title="Delete Tuition"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab !== "wishlist" &&
            (activeTab === "active"
              ? activeItems.length + activeTuitions.length
              : exchangedItems.length + completedTuitions.length) === 0 && (
              <div className="text-center py-20">
                <Package className="h-20 w-20 text-gray-400 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  No {activeTab} listings
                </h3>
                <p className="text-gray-600 text-lg mb-8 max-w-xl mx-auto">
                  {activeTab === "active"
                    ? isOwnProfile
                      ? "You haven't posted any items or tuitions yet."
                      : `${profileUser.username} hasn't posted any items or tuitions yet.`
                    : isOwnProfile
                    ? "You haven't completed any exchanges or tuitions yet."
                    : `${profileUser.username} hasn't completed any exchanges or tuitions yet.`}
                </p>
                {isOwnProfile && activeTab === "active" && (
                  <div className="flex justify-center gap-4">
                    <Link
                      to="/post-item"
                      className="bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-700 transition inline-flex items-center space-x-3 shadow-md"
                    >
                      <Package className="h-6 w-6" />
                      <span className="text-lg font-semibold">
                        Post Your First Item
                      </span>
                    </Link>
                    <Link
                      to="/post-tuition"
                      className="bg-green-600 text-white px-8 py-4 rounded-xl hover:bg-green-700 transition inline-flex items-center space-x-3 shadow-md"
                    >
                      <Package className="h-6 w-6" />
                      <span className="text-lg font-semibold">
                        Post Your First Tuition
                      </span>
                    </Link>
                  </div>
                )}
              </div>
            )}
        </div>

        {/* Settings Modal */}
        {isOwnProfile && (
          <SettingsModal
            isOpen={showSettings}
            onClose={() => setShowSettings(false)}
            onPasswordChange={handlePasswordChange}
            onAccountDeletion={handleAccountDeletion}
          />
        )}

        {/* Avatar Picker Modal */}
        {isOwnProfile && showAvatarPicker && (
          <AvatarPicker
            onClose={() => setShowAvatarPicker(false)}
            onAvatarChange={handleAvatarSelect}
            currentAvatar={profileUser?.profilePicture}
          />
        )}
      </div>
    </div>
  );
}
