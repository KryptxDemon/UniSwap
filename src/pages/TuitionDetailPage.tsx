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
  Mail,
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
        receiverId: tuition.post?.user?.userId || 0,
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
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tuition details...</p>
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
            onClick={() => navigate("/browse-tuitions")}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            Back to Browse Tuitions
          </button>
        </div>
      </div>
    );
  }

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
            onClick={() => navigate("/browse-tuitions")}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            Back to Browse Tuitions
          </button>
        </div>
      </div>
    );
  }

  const isOwner = user && tuition.post?.user?.userId === user.userId;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <button
              onClick={() => navigate("/browse-tuitions")}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Tuitions</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {tuition.subject} Tuition
                    </h1>
                    <div className="flex items-center space-x-4 text-gray-600">
                      <div className="flex items-center space-x-1">
                        <GraduationCap className="h-5 w-5" />
                        <span>{tuition.clazz}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-5 w-5" />
                        <span>
                          {tuition.location?.name || "Location not specified"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      tuition.tStatus
                    )}`}
                  >
                    {tuition.tStatus.charAt(0).toUpperCase() +
                      tuition.tStatus.slice(1)}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <div className="bg-green-100 p-2 rounded-lg">
                        <DollarSign className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Monthly Salary</p>
                        <p className="text-xl font-bold text-green-600">
                          ৳{tuition.salary}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <Calendar className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Days per Week</p>
                        <p className="text-xl font-bold text-blue-600">
                          {tuition.daysWeek} days
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-50 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <div className="bg-purple-100 p-2 rounded-lg">
                        <BookOpen className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Subject</p>
                        <p className="text-lg font-semibold text-purple-600">
                          {tuition.subject}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      Tuition Information
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Class Level</p>
                          <p className="font-medium text-gray-900">
                            {tuition.clazz}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Status</p>
                          <p className="font-medium text-gray-900">
                            {tuition.tStatus}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Location</p>
                          <p className="font-medium text-gray-900">
                            {tuition.location?.name || "Not specified"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Posted</p>
                          <p className="font-medium text-gray-900">
                            {tuition.post?.postTime
                              ? formatDate(tuition.post.postTime)
                              : "Unknown"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Tutor Information
                </h3>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-gray-100 p-3 rounded-full">
                    <User className="h-8 w-8 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {tuition.post?.user?.username || "Anonymous"}
                    </p>
                    <p className="text-sm text-gray-600">Tutor</p>
                  </div>
                </div>

                {tuition.post?.user?.email && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                    <Mail className="h-4 w-4" />
                    <span>{tuition.post.user.email}</span>
                  </div>
                )}
              </div>

              {!isOwner && user && (
                <div className="p-6">
                  <button
                    onClick={() => setShowMessageModal(true)}
                    className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <MessageCircle className="h-5 w-5" />
                    <span>Contact Tutor</span>
                  </button>
                </div>
              )}

              {!user && (
                <div className="p-6">
                  <button
                    onClick={() => navigate("/login")}
                    className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Sign In to Contact
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showMessageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Send Message to {tuition.post?.user?.username || "Tutor"}
            </h3>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 h-32 resize-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <div className="flex space-x-3 mt-4">
              <button
                onClick={() => setShowMessageModal(false)}
                className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSendMessage}
                disabled={!message.trim() || sendingMessage}
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {sendingMessage ? "Sending..." : "Send Message"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
