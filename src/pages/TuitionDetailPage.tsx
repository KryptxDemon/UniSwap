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
  DollarSign,
  BookOpen,
  Clock,
  GraduationCap,
} from "lucide-react";
import { demoTuitions, currentUser } from "../lib/demoData";
import { useAuth } from "../hooks/useAuth";

export function TuitionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [message, setMessage] = useState("");
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [wishlist, setWishlist] = useState<{ [key: string]: string }>(() => {
    const stored = localStorage.getItem("tuitionWishlist");
    return stored ? JSON.parse(stored) : {};
  });
  const [showWishlistModal, setShowWishlistModal] = useState(false);
  const [wishlistNote, setWishlistNote] = useState("");

  const tuition = demoTuitions.find((tuition) => tuition.id === id);

  if (!tuition) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Tuition Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The tuition you're looking for doesn't exist.
          </p>
          <button
            onClick={() => navigate("/browse/tuitions")}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            Back to Browse Tuitions
          </button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800";
      case "taken":
        return "bg-orange-100 text-orange-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
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
    console.log("Sending message:", message);
    setShowMessageModal(false);
    setMessage("");
    alert("Message sent successfully!");
  };

  const isWishlisted = !!wishlist[tuition.id];

  const handleWishlist = () => {
    if (isWishlisted) {
      const updated = { ...wishlist };
      delete updated[tuition.id];
      setWishlist(updated);
      localStorage.setItem("tuitionWishlist", JSON.stringify(updated));
    } else {
      setWishlistNote("");
      setShowWishlistModal(true);
    }
  };

  const handleSaveWishlist = () => {
    const updated = { 
      ...wishlist, 
      [tuition.id]: {
        note: wishlistNote,
        createdAt: new Date().toISOString()
      }
    };
    setWishlist(updated);
    localStorage.setItem("tuitionWishlist", JSON.stringify(updated));
    setShowWishlistModal(false);
  };

  const isOwnTuition = user?.id === tuition.tutor_id;

  const handleDeleteTuition = () => {
    const tuitionIndex = demoTuitions.findIndex(t => t.id === tuition.id);
    if (tuitionIndex !== -1) {
      demoTuitions.splice(tuitionIndex, 1);
    }
    navigate("/browse/tuitions");
  };

  const handleReportTuition = () => {
    console.log("Reporting tuition:", tuition.id, "Reason:", reportReason);
    setShowReportModal(false);
    setReportReason("");
    alert("Report submitted successfully!");
  };

  const handleReportUser = () => {
    console.log("Reporting user:", tuition.tutor_id);
    alert("User report submitted successfully!");
  };

  return (
    <div className="min-h-screen bg-green-50">
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
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tuition Header */}
            <div className="bg-white rounded-xl shadow-sm p-8">
              <div className="flex items-start justify-between mb-6">
                <h1 className="text-3xl font-bold text-gray-900">
                  {tuition.title}
                </h1>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    tuition.status
                  )}`}
                >
                  {tuition.status.charAt(0).toUpperCase() + tuition.status.slice(1)}
                </span>
              </div>

              <div className="prose max-w-none mb-6">
                <p className="text-gray-700 text-lg leading-relaxed">
                  {tuition.description}
                </p>
              </div>

              {/* Subjects */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Subjects</h3>
                <div className="flex flex-wrap gap-2">
                  {tuition.subjects.map((subject, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium"
                    >
                      {subject}
                    </span>
                  ))}
                </div>
              </div>

              {/* Tuition Details Grid */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-green-50 rounded-xl p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <DollarSign className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Salary</h4>
                      <p className="text-2xl font-bold text-green-600">৳{tuition.salary}</p>
                      <p className="text-sm text-gray-600">per month</p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-xl p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Schedule</h4>
                      <p className="text-2xl font-bold text-blue-600">{tuition.days_per_week}</p>
                      <p className="text-sm text-gray-600">days per week</p>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 rounded-xl p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <GraduationCap className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Class Level</h4>
                      <p className="text-lg font-bold text-purple-600">{tuition.class_level}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-orange-50 rounded-xl p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Location</h4>
                      <p className="text-lg font-bold text-orange-600">{tuition.location.name}</p>
                      <p className="text-sm text-gray-600 capitalize">{tuition.location.type.replace('-', ' ')}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Posted Date */}
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Clock className="h-4 w-4" />
                <span>Posted on {formatDate(tuition.created_at)}</span>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Tutor Info */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Tutor Information</h3>
              
              <div className="flex items-center space-x-4 mb-4">
                {tuition.tutor?.profile_picture ? (
                  <img
                    src={tuition.tutor.profile_picture}
                    alt={tuition.tutor.username}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">
                      {tuition.tutor?.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div>
                  <Link
                    to={`/profile/${tuition.tutor_id}`}
                    className="font-semibold text-gray-900 hover:text-green-600 transition-colors"
                  >
                    {tuition.tutor?.username}
                  </Link>
                  <p className="text-sm text-gray-600">Tutor</p>
                </div>
              </div>

              {tuition.tutor?.bio && (
                <p className="text-gray-600 text-sm mb-4">{tuition.tutor.bio}</p>
              )}
            </div>

            {/* Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
              {!isOwnTuition && (
                <button
                  onClick={() => setShowMessageModal(true)}
                  className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <MessageCircle className="h-5 w-5" />
                  <span>Contact Tutor</span>
                </button>
              )}

              <div className="flex space-x-3">
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
                  <span>{isWishlisted ? "Saved" : "Save"}</span>
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
                      {isOwnTuition ? (
                        <button
                          onClick={() => {
                            setShowDeleteModal(true);
                            setShowOptionsMenu(false);
                          }}
                          className="w-full px-4 py-3 text-left text-red-600 hover:bg-red-50 flex items-center space-x-2 rounded-t-lg"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span>Delete Tuition</span>
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
                            <span>Report Tuition</span>
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

              {isWishlisted && wishlist[tuition.id] && (
                <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded">
                  <div className="text-green-800 font-semibold mb-1">
                    Your Note:
                  </div>
                  <div className="text-green-900">{wishlist[tuition.id]}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Message Modal */}
      {showMessageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Send Message to {tuition.tutor?.username}
            </h3>

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Hi! I'm interested in your tuition offer..."
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
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
                className="flex-1 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                <h3 className="text-xl font-bold text-gray-900">Delete Tuition</h3>
                <p className="text-gray-600">This action cannot be undone</p>
              </div>
            </div>

            <p className="text-gray-700 mb-6">
              Are you sure you want to delete "{tuition.title}"? This will permanently remove the tuition offer and all associated data.
            </p>

            <div className="flex space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteTuition}
                className="flex-1 bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                Delete Tuition
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
                <h3 className="text-xl font-bold text-gray-900">Report Tuition</h3>
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
                onClick={handleReportTuition}
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
              Add Note to Saved Tuitions
            </h3>
            <textarea
              value={wishlistNote}
              onChange={(e) => setWishlistNote(e.target.value)}
              placeholder="Add a note about this tuition..."
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
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
                className="flex-1 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
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