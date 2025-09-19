import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  User as UserIcon,
  MessageCircle,
  Heart,
  Trash2,
  AlertTriangle,
  Phone,
  Copy,
  Tag,
  Boxes,
  Repeat,
  Edit3,
  Check,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { itemAPI, wishlistAPI } from "../services/apiService";
import { getBestItemDate, formatDetailedDate } from "../utils/dateUtils";

// Helper functions
const getImages = (item: any): string[] => {
  console.log("getImages called with item:", item);

  // The item should already be normalized by apiService.normalizeItem()
  // So we can directly use the normalized images array
  if (Array.isArray(item?.images) && item.images.length > 0) {
    console.log("Using normalized item.images:", item.images.length, "images");
    return item.images;
  }

  console.log("No images found or images array is empty");
  return [];
};

const getTypeColor = (type: string) => {
  switch (type?.toLowerCase()) {
    case "free":
      return "bg-green-100 text-green-800 border-green-200";
    case "swap":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "rent":
      return "bg-orange-100 text-orange-800 border-orange-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getConditionColor = (condition: string) => {
  switch (condition?.toLowerCase()) {
    case "new":
      return "bg-emerald-100 text-emerald-800 border-emerald-200";
    case "like-new":
      return "bg-teal-100 text-teal-800 border-teal-200";
    case "good":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "fair":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "poor":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export default function ItemDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showCompleteConfirm, setShowCompleteConfirm] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      if (!id) return;

      try {
        setLoading(true);
        console.log("Current user object:", user);
        console.log("User ID:", user?.userId);
        console.log("Auth token:", localStorage.getItem("auth_token"));

        const itemData = await itemAPI.getItemById(parseInt(id));
        setItem(itemData);

        // Check if item is in user's wishlist
        if (user?.userId) {
          console.log(
            "Checking wishlist status for user:",
            user.userId,
            "item:",
            parseInt(id)
          );
          try {
            const wishlistStatus = await wishlistAPI.checkWishlistStatus(
              user.userId,
              parseInt(id)
            );
            setIsInWishlist(wishlistStatus.inWishlist);
          } catch (wishlistErr) {
            console.warn("Failed to check wishlist status:", wishlistErr);
            // Don't set error state for wishlist - it's not critical
            setIsInWishlist(false);
          }
        } else {
          console.log("No user ID available, skipping wishlist check");
        }
      } catch (err) {
        console.error("Error fetching item:", err);
        setError("Failed to load item details");
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id, user]);

  const images = useMemo(() => getImages(item), [item]);

  const toggleWishlist = async () => {
    if (!user?.userId || !item?.itemId) return;

    setWishlistLoading(true);
    try {
      if (isInWishlist) {
        await wishlistAPI.removeFromWishlist(user.userId, item.itemId);
        setIsInWishlist(false);
      } else {
        await wishlistAPI.addToWishlist(user.userId, item.itemId, "");
        setIsInWishlist(true);
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleContactSeller = async () => {
    const sellerId = item?.user?.userId || item?.post?.user?.userId;
    console.log("Contact seller - Item data:", item);
    console.log("Contact seller - Seller ID:", sellerId);
    console.log("Contact seller - Current user ID:", user?.userId);

    if (!user?.userId || !sellerId) {
      console.error("Missing user ID or seller ID");
      return;
    }

    try {
      console.log("Navigating to messages with seller ID:", sellerId);
      navigate(`/messages?user=${sellerId}`);
    } catch (error) {
      console.error("Error navigating to messages:", error);
    }
  };

  const copyPhoneNumber = () => {
    if (item?.phone) {
      navigator.clipboard.writeText(item.phone);
      // You could add a toast notification here
    }
  };

  const handleDeleteItem = async () => {
    if (!item?.itemId) return;

    setActionLoading(true);
    try {
      await itemAPI.deleteItem(item.itemId);
      navigate("/browse"); // Redirect to browse page after deletion
    } catch (error) {
      console.error("Error deleting item:", error);
      // You could add error toast notification here
    } finally {
      setActionLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleMarkAsCompleted = async () => {
    if (!item?.itemId) return;

    setActionLoading(true);
    try {
      await itemAPI.markAsExchanged(item.itemId);
      // Refresh the item data to show updated status
      const updatedItem = await itemAPI.getItemById(item.itemId);
      setItem(updatedItem);
    } catch (error) {
      console.error("Error marking item as completed:", error);
      // You could add error toast notification here
    } finally {
      setActionLoading(false);
      setShowCompleteConfirm(false);
    }
  };

  const handleShareItem = async () => {
    const currentUrl = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: item?.name || "Check out this item",
          text: `${item?.name} - ${item?.description}`,
          url: currentUrl,
        });
      } catch (error) {
        // Fallback to clipboard copy if sharing fails
        navigator.clipboard.writeText(currentUrl);
      }
    } else {
      // Fallback to clipboard copy
      navigator.clipboard.writeText(currentUrl);
      // You could add toast notification here
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading item details...</p>
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-gray-900 mb-2">
            Item Not Found
          </h1>
          <p className="text-gray-600 mb-4">
            {error || "This item doesn't exist or has been removed."}
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

  const isOwner =
    user?.userId === (item?.user?.userId || item?.post?.user?.userId);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back
            </button>
            <div className="flex items-center space-x-4">
              {isOwner ? (
                // Owner actions
                <>
                  <button
                    onClick={() => navigate(`/edit-item/${item.itemId}`)}
                    className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                    title="Edit listing"
                  >
                    <Edit3 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setShowCompleteConfirm(true)}
                    disabled={actionLoading}
                    className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors disabled:opacity-50"
                    title="Mark as completed"
                  >
                    <Check className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    disabled={actionLoading}
                    className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors disabled:opacity-50"
                    title="Delete listing"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </>
              ) : (
                // Non-owner actions
                <button
                  onClick={toggleWishlist}
                  disabled={wishlistLoading}
                  className={`p-2 rounded-full transition-colors ${
                    isInWishlist
                      ? "bg-red-100 text-red-600 hover:bg-red-200"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                  title={
                    isInWishlist ? "Remove from wishlist" : "Add to wishlist"
                  }
                >
                  <Heart
                    className={`h-5 w-5 ${isInWishlist ? "fill-current" : ""}`}
                  />
                </button>
              )}
              <button
                onClick={handleShareItem}
                className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                title="Share item"
              >
                <ExternalLink className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Section */}
          <div className="space-y-4">
            <div className="aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden">
              {images.length > 0 ? (
                <div className="relative">
                  <img
                    src={images[selectedImageIndex]}
                    alt={item.itemName}
                    className="w-full h-96 object-cover"
                    onError={(e) => {
                      console.error("Image failed to load:", e);
                      console.error("Image src:", images[selectedImageIndex]);
                      console.error(
                        "Image src type:",
                        typeof images[selectedImageIndex]
                      );
                      console.error(
                        "Image src length:",
                        images[selectedImageIndex]?.length
                      );

                      // Hide the broken image and show fallback
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";

                      // Create fallback element
                      const fallback = document.createElement("div");
                      fallback.className =
                        "w-full h-96 bg-gradient-to-br from-red-100 to-red-200 flex flex-col items-center justify-center text-red-600";
                      fallback.innerHTML = `
                        <svg class="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <p class="text-sm font-medium">Image failed to load</p>
                        <p class="text-xs text-gray-500 mt-1">Invalid image data</p>
                      `;
                      target.parentElement?.appendChild(fallback);
                    }}
                    onLoad={(e) => {
                      console.log("Image loaded successfully");
                      console.log(
                        "Image dimensions:",
                        (e.target as HTMLImageElement).naturalWidth,
                        "x",
                        (e.target as HTMLImageElement).naturalHeight
                      );
                    }}
                  />
                </div>
              ) : (
                <div className="w-full h-96 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                  <div className="text-center">
                    <Tag className="h-16 w-16 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">No image available</p>
                  </div>
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-w-1 aspect-h-1 rounded-lg overflow-hidden border-2 ${
                      selectedImageIndex === index
                        ? "border-blue-500"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${item.itemName} ${index + 1}`}
                      className="w-full h-20 object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Item Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-3xl font-bold text-gray-900">
                  {item.itemName}
                </h1>
                <div className="flex space-x-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium border ${getTypeColor(
                      item.itemType
                    )}`}
                  >
                    {item.itemType?.charAt(0).toUpperCase() +
                      item.itemType?.slice(1)}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium border ${getConditionColor(
                      item.itemCondition
                    )}`}
                  >
                    {item.itemCondition}
                  </span>
                </div>
              </div>

              <div className="prose max-w-none mb-6">
                <p
                  className={`text-gray-700 ${
                    !showFullDescription && item.description?.length > 300
                      ? "line-clamp-4"
                      : ""
                  }`}
                >
                  {item.description}
                </p>
                {item.description?.length > 300 && (
                  <button
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-2"
                  >
                    {showFullDescription ? "Show less" : "Show more"}
                  </button>
                )}
              </div>

              {/* Swap Details */}
              {item.itemType === "swap" && item.swapWith && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-blue-900 mb-2 flex items-center">
                    <Repeat className="h-5 w-5 mr-2" />
                    Looking to swap for:
                  </h3>
                  <p className="text-blue-800">{item.swapWith}</p>
                </div>
              )}

              {/* Item Information Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center space-x-3">
                  <Boxes className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Category</p>
                    <p className="font-medium">
                      {item.category?.categoryName ||
                        item.category?.name ||
                        (typeof item.category === "string"
                          ? item.category
                          : "Uncategorized")}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium">
                      {item.location?.locationName ||
                        item.location?.name ||
                        (typeof item.location === "string"
                          ? item.location
                          : "Unknown")}
                    </p>
                    {item.locationType && (
                      <p className="text-xs text-gray-500 capitalize">
                        {item.locationType}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Posted</p>
                    <p className="font-medium">
                      {formatDetailedDate(getBestItemDate(item))}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Posted by</p>
                    <p className="font-medium">
                      {item.user?.username ||
                        item.post?.user?.username ||
                        "Unknown user"}
                    </p>
                  </div>
                </div>

                {item.phone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Contact</p>
                      <div className="flex items-center space-x-2">
                        <p className="font-medium">{item.phone}</p>
                        <button
                          onClick={copyPhoneNumber}
                          className="text-blue-600 hover:text-blue-700"
                          title="Copy phone number"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              {!isOwner && (
                <div className="flex space-x-4">
                  <button
                    onClick={handleContactSeller}
                    className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2"
                  >
                    <MessageCircle className="h-5 w-5" />
                    <span>Contact Seller</span>
                  </button>
                  {item.phone && (
                    <a
                      href={`tel:${item.phone}`}
                      className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 flex items-center justify-center space-x-2"
                    >
                      <Phone className="h-5 w-5" />
                      <span>Call</span>
                    </a>
                  )}
                </div>
              )}

              {isOwner && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800 font-medium">
                    This is your listing
                  </p>
                  <p className="text-yellow-700 text-sm">
                    You can edit or delete this item from your profile page.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-red-100 p-2 rounded-full">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Delete Listing
                </h3>
                <p className="text-sm text-gray-500">
                  This action cannot be undone
                </p>
              </div>
            </div>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete "{item?.name}"? This will
              permanently remove the listing.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={actionLoading}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteItem}
                disabled={actionLoading}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 flex items-center justify-center"
              >
                {actionLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mark as Completed Confirmation Modal */}
      {showCompleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-green-100 p-2 rounded-full">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Mark as Completed
                </h3>
                <p className="text-sm text-gray-500">
                  This will mark the item as exchanged
                </p>
              </div>
            </div>
            <p className="text-gray-700 mb-6">
              Mark "{item?.name}" as completed? This indicates the item has been
              successfully exchanged or donated.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowCompleteConfirm(false)}
                disabled={actionLoading}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleMarkAsCompleted}
                disabled={actionLoading}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center justify-center"
              >
                {actionLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  "Mark Complete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
