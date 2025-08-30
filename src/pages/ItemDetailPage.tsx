import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  User,
  MessageCircle,
  Heart,
  Share2,
  Flag,
  Trash2,
  MoreVertical,
  AlertTriangle,
} from "lucide-react";
import { demoItems, currentUser } from "../lib/demoData";
import { useAuth } from "../hooks/useAuth";

export function ItemDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [message, setMessage] = useState("");
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [wishlist, setWishlist] = useState<{ [key: string]: string }>(() => {
    const stored = localStorage.getItem("wishlist");
    return stored ? JSON.parse(stored) : {};
  });
  const [showWishlistModal, setShowWishlistModal] = useState(false);
  const [wishlistNote, setWishlistNote] = useState("");

  const item = demoItems.find((item) => item.id === id);

  if (!item) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Item Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The item you're looking for doesn't exist.
          </p>
          <button
            onClick={() => navigate("/browse")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Browse
          </button>
        </div>
      </div>
    );
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "free":
        return "bg-green-100 text-green-800";
      case "swap":
        return "bg-blue-100 text-blue-800";
      case "rent":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "New":
        return "bg-emerald-100 text-emerald-800";
      case "Like New":
        return "bg-blue-100 text-blue-800";
      case "Good":
        return "bg-yellow-100 text-yellow-800";
      case "Fair":
        return "bg-orange-100 text-orange-800";
      case "Poor":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleSendMessage = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    // In a real app, this would send the message
    console.log("Sending message:", message);
    setShowMessageModal(false);
    setMessage("");
    alert("Message sent successfully!");
  };

  const isWishlisted = !!wishlist[item.id];

  const handleWishlist = () => {
    if (isWishlisted) {
      const updated = { ...wishlist };
      delete updated[item.id];
      setWishlist(updated);
      localStorage.setItem("wishlist", JSON.stringify(updated));
    } else {
      setWishlistNote("");
      setShowWishlistModal(true);
    }
  };

  const handleSaveWishlist = () => {
    const updated = { 
      ...wishlist, 
      [item.id]: {
        note: wishlistNote,
        createdAt: new Date().toISOString()
      }
    };
    setWishlist(updated);
    localStorage.setItem("wishlist", JSON.stringify(updated));
    setShowWishlistModal(false);
  };

  const isOwnItem = user?.id === item.user_id;

  const handleDeleteItem = () => {
    // In a real app, this would delete from backend
    const itemIndex = demoItems.findIndex(i => i.id === item.id);
    if (itemIndex !== -1) {
      demoItems.splice(itemIndex, 1);
    }
    navigate("/browse");
  };

  const handleReportItem = () => {
    // In a real app, this would send report to backend
    console.log("Reporting item:", item.id, "Reason:", reportReason);
    setShowReportModal(false);
    setReportReason("");
    alert("Report submitted successfully!");
  };

  const handleReportUser = () => {
    // In a real app, this would send user report to backend
    console.log("Reporting user:", item.user_id);
    alert("User report submitted successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-w-16 aspect-h-12 bg-gray-200 rounded-xl overflow-hidden">
              {item.images && item.images.length > 0 ? (
                <img
                  src={item.images[currentImageIndex]}
                  alt={item.title}
                  className="w-full h-96 object-cover"
                />
              ) : (
                <div className="w-full h-96 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <div className="text-center">
                    <div className="h-16 w-16 bg-gray-300 rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-500">No image available</p>
                  </div>
                </div>
              )}
            </div>

            {item.images && item.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {item.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      currentImageIndex === index
                        ? "border-blue-500"
                        : "border-gray-200"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${item.title} ${index + 1}`}
                      className="w-full h-full object-cover"
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
                  {item.title}
                </h1>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(
                    item.type
                  )}`}
                >
                  {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                </span>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                  {item.category.name}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getConditionColor(
                    item.condition
                  )}`}
                >
                  {item.condition}
                </span>
                {item.department && (
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                    {item.department}
                  </span>
                )}
              </div>
            </div>

            <div className="prose max-w-none">
              <p className="text-gray-700 text-lg leading-relaxed">
                {item.description}
              </p>
            </div>

            {/* Item Info */}
            <div className="bg-gray-50 rounded-xl p-6 space-y-4 mb-6">
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-gray-400" />
                <div>
                  <span className="text-gray-700 font-medium">
                    {item.location.type === "on-campus" ? "On Campus" : "Off Campus"}
                  </span>
                  <span className="text-gray-500 mx-2">•</span>
                  <span className="text-gray-700">{item.location.name}</span>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <span className="text-gray-700">
                  Posted on {formatDate(item.created_at)}
                </span>
              </div>

              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-gray-400" />
                <Link
                  to={`/profile/${item.user_id}`}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  {item.user?.username}
                </Link>
              </div>

              {item.department && (
                <div className="flex items-center space-x-3">
                  <div className="h-5 w-5 bg-purple-100 rounded-full flex items-center justify-center">
                    <div className="h-2 w-2 bg-purple-600 rounded-full"></div>
                  </div>
                  <span className="text-gray-700">Department: {item.department}</span>
                </div>
              )}
            </div>

            {/* Additional Details */}
            <div className="bg-blue-50 rounded-xl p-6 space-y-3 mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Item Details</h3>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span className="text-gray-700">
                  <span className="font-medium">Category:</span> {item.category.name}
                </span>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span className="text-gray-700">
                  <span className="font-medium">Condition:</span> {item.condition}
                </span>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span className="text-gray-700">
                  <span className="font-medium">Type:</span> {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4">
              {!isOwnItem && (
                <button
                  onClick={() => setShowMessageModal(true)}
                  className="w-full bg-pine-green text-white py-4 rounded-xl font-semibold hover:bg-dark-teal transition-colors flex items-center justify-center space-x-2"
                >
                  <MessageCircle className="h-5 w-5" />
                  <span>Contact {item.user?.username}</span>
                </button>
              )}

              <div className="flex space-x-4">
                <button
                  className={`flex-1 ${
                    isWishlisted
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  } py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2`}
                  onClick={handleWishlist}
                >
                  <Heart
                    className="h-5 w-5"
                    fill={isWishlisted ? "#22c55e" : "none"}
                  />
                  <span>{isWishlisted ? "Wishlisted" : "Add to Wishlist"}</span>
                </button>

                <button className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2">
                  <Share2 className="h-5 w-5" />
                  <span>Share</span>
                </button>

                <div className="relative">
                  <button 
                    onClick={() => setShowOptionsMenu(!showOptionsMenu)}
                    className="px-4 bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                  >
                    <MoreVertical className="h-5 w-5" />
                  </button>
                  
                  {showOptionsMenu && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                      {isOwnItem ? (
                        <button
                          onClick={() => {
                            setShowDeleteModal(true);
                            setShowOptionsMenu(false);
                          }}
                          className="w-full px-4 py-3 text-left text-red-600 hover:bg-red-50 flex items-center space-x-2 rounded-t-lg"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span>Delete Post</span>
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              setShowReportModal(true);
                              setShowOptionsMenu(false);
                            }}
                            className="w-full px-4 py-3 text-left text-red-600 hover:bg-red-50 flex items-center space-x-2 rounded-t-lg"
                          >
                            <Flag className="h-4 w-4" />
                            <span>Report Post</span>
                          </button>
                          <button
                            onClick={() => {
                              handleReportUser();
                              setShowOptionsMenu(false);
                            }}
                            className="w-full px-4 py-3 text-left text-red-600 hover:bg-red-50 flex items-center space-x-2 rounded-b-lg border-t border-gray-100"
                          >
                            <AlertTriangle className="h-4 w-4" />
                            <span>Report User</span>
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {isWishlisted && wishlist[item.id] && (
              <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded mb-4">
                <div className="text-green-800 font-semibold mb-1">
                  Your Wishlist Note:
                </div>
                <div className="text-green-900">{wishlist[item.id]}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Message Modal */}
      {showMessageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Send Message to {item.user?.username}
            </h3>

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Hi! I'm interested in your item..."
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={4}
            />

            <div className="flex space-x-4 mt-6">
              <button
                onClick={() => setShowMessageModal(false)}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSendMessage}
                disabled={!message.trim()}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Send Message
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Delete Post</h3>
                <p className="text-gray-600">This action cannot be undone</p>
              </div>
            </div>

            <p className="text-gray-700 mb-6">
              Are you sure you want to delete "{item.title}"? This will permanently remove the post and all associated data.
            </p>

            <div className="flex space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteItem}
                className="flex-1 bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                Delete Post
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Flag className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Report Post</h3>
                <p className="text-gray-600">Help us keep the community safe</p>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for reporting
              </label>
              <select
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500"
                required
              >
                <option value="">Select a reason</option>
                <option value="inappropriate">Inappropriate content</option>
                <option value="spam">Spam or misleading</option>
                <option value="fake">Fake or fraudulent</option>
                <option value="harassment">Harassment</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => setShowReportModal(false)}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReportItem}
                disabled={!reportReason}
                className="flex-1 bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Wishlist Modal */}
      {showWishlistModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Add Note to Wishlist
            </h3>
            <textarea
              value={wishlistNote}
              onChange={(e) => setWishlistNote(e.target.value)}
              placeholder="Add a note about this item..."
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={4}
            />
            <div className="flex space-x-4 mt-6">
              <button
                onClick={() => setShowWishlistModal(false)}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveWishlist}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
