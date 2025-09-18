import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  User,
  MessageCircle,
  DollarSign,
  BookOpen,
  GraduationCap,
  Phone,
  Copy,
  Clock,
  Users,
  Repeat,
  ExternalLink,
  CheckCircle,
  Star,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { tuitionAPI, messageAPI } from "../services/apiService";
import { Tuition } from "../types";

export function TuitionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tuition, setTuition] = useState<Tuition | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [message, setMessage] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const [showFullSwapDetails, setShowFullSwapDetails] = useState(false);

  useEffect(() => {
    const fetchTuition = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const tuitionData = await tuitionAPI.getTuitionById(parseInt(id));
        setTuition(tuitionData);
      } catch (err) {
        setError("Failed to load tuition details");
        console.error("Error fetching tuition:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTuition();
  }, [id]);

  const handleSendMessage = async () => {
    if (!user || !tuition || !message.trim()) return;

    setSendingMessage(true);
    try {
      await messageAPI.sendMessage({
        senderId: Number(user.userId),
        receiverId: tuition.user?.userId || 0,
        text: message.trim(),
      });

      setShowMessageModal(false);
      setMessage("");
      alert("Message sent successfully!");
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message. Please try again.");
    } finally {
      setSendingMessage(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Date not specified";
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInHours = Math.floor(
        (now.getTime() - date.getTime()) / (1000 * 60 * 60)
      );

      if (diffInHours < 1) return "Just posted";
      if (diffInHours < 24) return `${diffInHours}h ago`;
      if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "Invalid date";
    }
  };

  const copyPhoneNumber = () => {
    if (tuition?.contactPhone) {
      navigator.clipboard.writeText(tuition.contactPhone);
      // You could add a toast notification here
    }
  };

  const openAddressInMaps = () => {
    if (tuition?.addressUrl) {
      window.open(tuition.addressUrl, "_blank");
    }
  };

  const formatSubjects = (subject: string) => {
    return subject || "Not specified";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tuition details...</p>
        </div>
      </div>
    );
  }

  if (error || !tuition) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <GraduationCap className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-gray-900 mb-2">
            Tuition Not Found
          </h1>
          <p className="text-gray-600 mb-4">
            {error || "This tuition listing doesn't exist or has been removed."}
          </p>
          <button
            onClick={() => navigate("/browse/tuitions")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Browse Tuitions
          </button>
        </div>
      </div>
    );
  }

  const isOwner = user?.userId === tuition.user?.userId;

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
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">
                  {formatSubjects(tuition.subject)} Tuition
                </h1>
                <p className="text-blue-100 text-lg">
                  Class {tuition.clazz} - {tuition.subject}
                </p>
              </div>
              <div className="ml-6">
                <span
                  className={`px-4 py-2 rounded-full text-sm font-medium border bg-white/20 text-white border-white/30`}
                >
                  {tuition.tStatus || "Available"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="flex items-center space-x-3">
                <DollarSign className="h-6 w-6 text-green-300" />
                <div>
                  <p className="text-blue-100 text-sm">Salary</p>
                  <p className="text-xl font-bold">৳{tuition.salary}/hour</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Clock className="h-6 w-6 text-yellow-300" />
                <div>
                  <p className="text-blue-100 text-sm">Days per Week</p>
                  <p className="text-xl font-bold">{tuition.daysWeek} days</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <GraduationCap className="h-6 w-6 text-purple-300" />
                <div>
                  <p className="text-blue-100 text-sm">Level</p>
                  <p className="text-xl font-bold">{tuition.clazz}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-8 space-y-8">
            {/* Subjects & Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <BookOpen className="h-6 w-6 mr-2 text-blue-600" />
                    Subject Information
                  </h2>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-lg font-medium text-gray-900 mb-2">
                      {formatSubjects(tuition.subject)}
                    </p>
                    <p className="text-gray-600">
                      for {tuition.clazz} level students
                    </p>
                  </div>
                </div>

                {/* Tutor Preference */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                    <Users className="h-5 w-5 mr-2 text-purple-600" />
                    Tutor Preference
                  </h3>
                  <span className="px-3 py-1 rounded-full text-sm font-medium border bg-purple-100 text-purple-800 border-purple-200">
                    {tuition.tutorPreference || "No preference"}
                  </span>
                </div>

                {/* Location Information */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-red-600" />
                    Location
                  </h3>
                  <div className="space-y-2">
                    <p className="text-gray-700">
                      {tuition.location || "Location not specified"}
                    </p>
                    {tuition.addressUrl && (
                      <button
                        onClick={openAddressInMaps}
                        className="flex items-center text-blue-600 hover:text-blue-700 text-sm"
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        View on map
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {/* Contact Information */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <User className="h-6 w-6 mr-2 text-green-600" />
                    Contact Information
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm text-gray-500">Posted by</p>
                        <p className="font-medium text-gray-900">
                          {tuition.user?.username || "Unknown user"}
                        </p>
                      </div>
                      <CheckCircle className="h-6 w-6 text-green-500" />
                    </div>

                    {tuition.contactPhone && (
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm text-gray-500">Phone Number</p>
                          <p className="font-medium text-gray-900">
                            {tuition.contactPhone}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={copyPhoneNumber}
                            className="p-2 text-blue-600 hover:text-blue-700"
                            title="Copy phone number"
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                          <a
                            href={`tel:${tuition.contactPhone}`}
                            className="p-2 text-green-600 hover:text-green-700"
                            title="Call"
                          >
                            <Phone className="h-4 w-4" />
                          </a>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                      <Calendar className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Posted</p>
                        <p className="font-medium text-gray-900">
                          {formatDate(tuition.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tuition Exchange Section */}
            {tuition.canSwap && tuition.swapDetails && (
              <div className="border-t pt-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Repeat className="h-6 w-6 mr-2 text-blue-600" />
                  Tuition Exchange Available
                </h2>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <Star className="h-5 w-5 text-blue-600" />
                      <h3 className="font-semibold text-blue-900">
                        Exchange Details
                      </h3>
                    </div>
                    <span className="px-3 py-1 bg-blue-200 text-blue-800 rounded-full text-sm font-medium">
                      Exchange Available
                    </span>
                  </div>
                  <div
                    className={`text-blue-800 ${
                      !showFullSwapDetails && tuition.swapDetails.length > 200
                        ? "line-clamp-3"
                        : ""
                    }`}
                  >
                    {tuition.swapDetails}
                  </div>
                  {tuition.swapDetails.length > 200 && (
                    <button
                      onClick={() =>
                        setShowFullSwapDetails(!showFullSwapDetails)
                      }
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-2"
                    >
                      {showFullSwapDetails ? "Show less" : "Show more"}
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {!isOwner && (
              <div className="border-t pt-8">
                <div className="flex space-x-4">
                  <button
                    onClick={() => setShowMessageModal(true)}
                    className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2"
                  >
                    <MessageCircle className="h-5 w-5" />
                    <span>Send Message</span>
                  </button>
                  {tuition.contactPhone && (
                    <a
                      href={`tel:${tuition.contactPhone}`}
                      className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 flex items-center justify-center space-x-2"
                    >
                      <Phone className="h-5 w-5" />
                      <span>Call Now</span>
                    </a>
                  )}
                </div>
              </div>
            )}

            {isOwner && (
              <div className="border-t pt-8">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800 font-medium">
                    This is your tuition listing
                  </p>
                  <p className="text-yellow-700 text-sm">
                    You can edit or delete this listing from your profile page.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Message Modal */}
      {showMessageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Send Message</h3>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="w-full border border-gray-300 rounded-lg p-3 h-32 resize-none"
              rows={4}
            />
            <div className="flex space-x-3 mt-4">
              <button
                onClick={() => setShowMessageModal(false)}
                className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSendMessage}
                disabled={sendingMessage || !message.trim()}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {sendingMessage ? "Sending..." : "Send"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
