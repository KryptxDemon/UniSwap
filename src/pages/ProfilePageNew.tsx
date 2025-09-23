import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Calendar,
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
  CheckCircle,
  Repeat,
  Eye,
  EyeOff,
  X,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { ItemCard } from "../components/Items/ItemCard";
import { userAPI, itemAPI, wishlistAPI } from "../services/apiService";
import { getProfilePictureUrl } from "../utils/imageUtils";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  profileUser: any;
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
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [editedBio, setEditedBio] = useState("");
  const [showSettings, setShowSettings] = useState(false);

  const isOwnProfile = !!authUser && (!id || id === authUser.userId.toString());

  // State for API data
  const [userItems, setUserItems] = useState<any[]>([]);
  const [exchangedItems, setExchangedItems] = useState<any[]>([]);
  const [wishlistedItems, setWishlistedItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch profile user data
  useEffect(() => {
    const fetchProfileUser = async () => {
      try {
        if (!id) {
          if (authUser) {
            setProfileUser(authUser);
            setProfilePic(getProfilePictureUrl(authUser.profilePicture));
            setEditedBio(authUser.bio || "");
          }
        } else {
          const user = await userAPI.getUserById(Number(id));
          setProfileUser(user);
          setProfilePic(getProfilePictureUrl(user.profilePicture));
          setEditedBio(user.bio || "");
        }
      } catch (err) {
        console.error("Error fetching profile user:", err);
        setError("Failed to load user profile");
      }
    };

    if (!id && authUser) {
      setProfileUser(authUser);
      setProfilePic(getProfilePictureUrl(authUser.profilePicture));
      setEditedBio(authUser.bio || "");
    } else if (id) {
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

        // Separate active and exchanged items
        const activeItems = items.filter(
          (item: any) => item.status === "available" || !item.status
        );
        const exchangedItems = items.filter(
          (item: any) =>
            item.status === "exchanged" ||
            item.status === "donated" ||
            item.status === "rented"
        );

        setUserItems(activeItems);
        setExchangedItems(exchangedItems);

        // If viewing own profile, fetch wishlist data
        if (isOwnProfile && authUser) {
          const wishlists = await wishlistAPI.getUserWishlists(
            Number(authUser.userId)
          );
          const itemWishlists = wishlists.filter(
            (w: any) => Array.isArray(w.items) && w.items.length > 0
          );
          const items = itemWishlists.flatMap((w: any) =>
            w.items.map((item: any) => ({
              ...item,
              wishlistNotes: w.notes,
              wishlistId: w.wishlistId,
              isAvailable: item.status === "available",
            }))
          );
          setWishlistedItems(items);
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [profileUser, isOwnProfile, authUser]);

  const handleBioSave = async () => {
    if (!authUser || !isOwnProfile) return;

    try {
      await updateProfile({ bio: editedBio });
      setProfileUser({ ...profileUser, bio: editedBio });
      setIsEditingBio(false);
    } catch (error) {
      console.error("Error updating bio:", error);
      alert("Failed to update bio");
    }
  };

  const handlePasswordChange = async (
    oldPassword: string,
    newPassword: string
  ) => {
    // Implement password change API call
    console.log("Password change requested", { oldPassword, newPassword });
    // This would call your backend API to change password
  };

  const handleAccountDeletion = async (reason: string) => {
    // Implement account deletion request API call
    console.log("Account deletion requested", { reason });
    // This would send a request to admin with the reason
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Unknown";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return "Invalid date";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profileUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <User className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-gray-900 mb-2">
            Profile Not Found
          </h1>
          <p className="text-gray-600 mb-4">
            {error || "This profile doesn't exist."}
          </p>
          <button
            onClick={() => navigate("/browse")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Browse
          </button>
        </div>
      </div>
    );
  }

  const getTabData = () => {
    switch (activeTab) {
      case "active":
        return { items: userItems, title: "Active Listings" };
      case "exchanged":
        return { items: exchangedItems, title: "Exchange History" };
      case "wishlist":
        return { items: wishlistedItems, title: "Wishlist" };
      default:
        return { items: [], title: "" };
    }
  };

  const { items, title } = getTabData();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-8">
            {/* Profile Picture */}
            <div className="flex-shrink-0 mx-auto lg:mx-0 mb-6 lg:mb-0">
              <div className="relative">
                <img
                  src={profilePic}
                  alt={profileUser.username}
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                />
                {isOwnProfile && (
                  <button className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700">
                    <Edit3 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center lg:text-left">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {profileUser.username}
                  </h1>
                  <div className="space-y-1 text-gray-600">
                    <div className="flex items-center justify-center lg:justify-start space-x-2">
                      <Mail className="h-4 w-4" />
                      <span>{profileUser.email}</span>
                    </div>
                    <div className="flex items-center justify-center lg:justify-start space-x-2">
                      <CreditCard className="h-4 w-4" />
                      <span>ID: {profileUser.studentId}</span>
                    </div>
                    <div className="flex items-center justify-center lg:justify-start space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>Joined {formatDate(profileUser.createdAt)}</span>
                    </div>
                  </div>
                </div>

                {isOwnProfile && (
                  <div className="mt-4 lg:mt-0">
                    <button
                      onClick={() => setShowSettings(true)}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </button>
                  </div>
                )}
              </div>

              {/* Bio Section */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">Bio</h3>
                  {isOwnProfile && (
                    <button
                      onClick={() => setIsEditingBio(!isEditingBio)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {isEditingBio && isOwnProfile ? (
                  <div className="space-y-3">
                    <textarea
                      value={editedBio}
                      onChange={(e) => setEditedBio(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg p-3 h-24"
                      placeholder="Tell others about yourself..."
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={handleBioSave}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setIsEditingBio(false);
                          setEditedBio(profileUser.bio || "");
                        }}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-700">
                    {profileUser.bio || "No bio available."}
                  </p>
                )}
              </div>

              {/* Action Buttons for Other Users */}
              {!isOwnProfile && (
                <div className="flex space-x-4 justify-center lg:justify-start">
                  <button className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Send Message
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 pt-8 border-t mt-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {userItems.length}
              </div>
              <div className="text-gray-600">Active Listings</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {exchangedItems.length}
              </div>
              <div className="text-gray-600">Exchanges</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {wishlistedItems.length}
              </div>
              <div className="text-gray-600">Wishlist Items</div>
            </div>
          </div>
        </div>

        {/* My Listings Section */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              My Listings
            </h2>

            {/* Tabs */}
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setActiveTab("active")}
                className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                  activeTab === "active"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <CheckCircle className="h-4 w-4 inline mr-2" />
                Active ({userItems.length})
              </button>
              <button
                onClick={() => setActiveTab("exchanged")}
                className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                  activeTab === "exchanged"
                    ? "bg-white text-green-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Repeat className="h-4 w-4 inline mr-2" />
                Exchanged ({exchangedItems.length})
              </button>
              <button
                onClick={() => setActiveTab("wishlist")}
                className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                  activeTab === "wishlist"
                    ? "bg-white text-red-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Heart className="h-4 w-4 inline mr-2" />
                Wishlist ({wishlistedItems.length})
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              {title}
            </h3>

            {items.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">
                  {activeTab === "active" && "No active listings yet."}
                  {activeTab === "exchanged" && "No exchange history yet."}
                  {activeTab === "wishlist" && "No items in wishlist yet."}
                </p>
                {activeTab === "active" && isOwnProfile && (
                  <Link
                    to="/post-item"
                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Package className="h-5 w-5 mr-2" />
                    Post Your First Item
                  </Link>
                )}
                {activeTab === "wishlist" && isOwnProfile && (
                  <Link
                    to="/browse"
                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Heart className="h-5 w-5 mr-2" />
                    Browse Items
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item) => (
                  <div key={item.itemId || item.id} className="relative">
                    <ItemCard item={item} />

                    {/* Wishlist specific overlays */}
                    {activeTab === "wishlist" && (
                      <>
                        {!item.isAvailable && (
                          <div className="absolute inset-0 bg-gray-900 bg-opacity-50 rounded-xl flex items-center justify-center">
                            <span className="bg-gray-800 text-white px-3 py-1 rounded-full text-sm">
                              No longer available
                            </span>
                          </div>
                        )}
                        {item.wishlistNotes && (
                          <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <p className="text-sm text-yellow-800">
                              <strong>Notes:</strong> {item.wishlistNotes}
                            </p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        profileUser={profileUser}
        onPasswordChange={handlePasswordChange}
        onAccountDeletion={handleAccountDeletion}
      />
    </div>
  );
}
