import React, { useRef, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  MessageCircle,
  Search,
  Send,
  ArrowLeft,
  MoreVertical,
  Smile,
  Image,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { messageAPI, userAPI } from "../services/apiService";
import { getProfilePictureUrl } from "../utils/imageUtils";

// Profile Picture Component with fallback
interface ProfilePictureProps {
  src?: string;
  alt: string;
  size: "sm" | "md" | "lg";
  className?: string;
}

function ProfilePicture({
  src,
  alt,
  size,
  className = "",
}: ProfilePictureProps) {
  const [imageError, setImageError] = useState(false);
  const profileImageUrl = getProfilePictureUrl(src);

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  if (!src || imageError) {
    return (
      <div
        className={`${sizeClasses[size]} rounded-full flex items-center justify-center bg-gradient-to-br from-pine-green to-bright-cyan ${className}`}
      >
        <span className={`text-white font-semibold ${textSizes[size]}`}>
          {alt.charAt(0).toUpperCase()}
        </span>
      </div>
    );
  }

  return (
    <img
      src={profileImageUrl}
      alt={alt}
      className={`${sizeClasses[size]} rounded-full object-cover ${className}`}
      onError={() => setImageError(true)}
    />
  );
}

interface ConversationData {
  partnerId: number;
  partnerUsername: string;
  partnerProfilePicture?: string;
  lastMessage: string;
  lastMessageTime: string;
  messageCount: number;
  unreadCount?: number;
}

interface UserSummary {
  userId: number;
  displayUsername: string;
  profilePicture?: string;
}

interface MessageData {
  messageId: number;
  text: string;
  sentTime: string;
  sender: UserSummary;
  receiver: UserSummary;
}

export function MessagesPage() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [conversations, setConversations] = useState<ConversationData[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<ConversationData | null>(null);
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [processedUrlParam, setProcessedUrlParam] = useState<string | null>(
    null
  );

  // Load conversations on component mount
  useEffect(() => {
    if (user?.userId) {
      loadConversations();
    }
  }, [user]);

  // Handle URL parameter for starting conversation with specific user
  useEffect(() => {
    const targetUserId = searchParams.get("user");

    // Skip if we've already processed this URL parameter or if no target user
    if (!targetUserId || !user?.userId || processedUrlParam === targetUserId) {
      return;
    }

    console.log("Processing URL parameter 'user':", targetUserId);
    console.log("Current user ID:", user?.userId);
    console.log("Conversations count:", conversations.length);

    const targetUserIdNum = parseInt(targetUserId);

    // Find existing conversation
    const existingConversation = conversations.find(
      (conv) => conv.partnerId === targetUserIdNum
    );

    console.log("Existing conversation found:", existingConversation);

    if (existingConversation) {
      console.log("Loading existing conversation");
      setSelectedConversation(existingConversation);
      loadMessages(existingConversation.partnerId);
    } else {
      // Create a new conversation placeholder
      console.log("Creating new conversation");
      startNewConversation(targetUserIdNum);
    }

    // Mark this URL parameter as processed
    setProcessedUrlParam(targetUserId);
  }, [searchParams, conversations, user, processedUrlParam]);

  const startNewConversation = async (partnerId: number) => {
    try {
      console.log("Starting new conversation with partner ID:", partnerId);

      // Fetch partner user details
      const partnerUser = await userAPI.getUserById(partnerId);
      console.log("Partner user data:", partnerUser);

      // Create a new conversation placeholder
      const newConversation: ConversationData = {
        partnerId: partnerId,
        partnerUsername:
          partnerUser.username ||
          partnerUser.displayUsername ||
          `User ${partnerId}`,
        partnerProfilePicture: partnerUser.profilePicture,
        lastMessage: "Start a conversation...",
        lastMessageTime: new Date().toISOString(),
        messageCount: 0,
        unreadCount: 0,
      };

      console.log("Created new conversation:", newConversation);
      setSelectedConversation(newConversation);
      setMessages([]); // Empty messages for new conversation
    } catch (error) {
      console.error("Error starting new conversation:", error);

      // Create a fallback conversation even if user details fetch fails
      const fallbackConversation: ConversationData = {
        partnerId: partnerId,
        partnerUsername: `User ${partnerId}`,
        partnerProfilePicture: undefined,
        lastMessage: "Start a conversation...",
        lastMessageTime: new Date().toISOString(),
        messageCount: 0,
        unreadCount: 0,
      };

      console.log("Using fallback conversation:", fallbackConversation);
      setSelectedConversation(fallbackConversation);
      setMessages([]);
    }
  };

  const loadConversations = async () => {
    try {
      const conversationsData = await messageAPI.getUserConversations(
        user!.userId
      );
      setConversations(conversationsData);
    } catch (error) {
      console.error("Error loading conversations:", error);
    }
  };

  const loadMessages = async (partnerId: number) => {
    try {
      const messagesData = await messageAPI.getConversation(
        user!.userId,
        partnerId
      );
      setMessages(messagesData);

      // Mark messages as read when conversation is loaded
      try {
        await messageAPI.markMessagesAsRead(partnerId);
        // Reload conversations to update unread counts
        await loadConversations();
      } catch (error) {
        console.error("Error marking messages as read:", error);
      }
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.partnerUsername.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isSendingRef = useRef(false);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || isSendingRef.current)
      return;

    isSendingRef.current = true;
    const messageContent = newMessage.trim();

    // Clear input immediately to prevent duplicate sends
    setNewMessage("");

    try {
      await messageAPI.sendMessage({
        senderId: user!.userId,
        receiverId: selectedConversation.partnerId,
        text: messageContent,
      });

      // Reload messages and conversations
      await loadMessages(selectedConversation.partnerId);
      await loadConversations();
    } catch (error) {
      console.error("Error sending message:", error);
      // Restore message on error
      setNewMessage(messageContent);
    } finally {
      // Reset the sending flag after a short delay
      setTimeout(() => {
        isSendingRef.current = false;
      }, 1000);
    }
  };

  const imageInputRef = useRef<HTMLInputElement | null>(null);

  const handleSendImage = (_e: React.ChangeEvent<HTMLInputElement>) => {
    // Image functionality can be implemented later with file upload
    alert("Image sending will be implemented in a future update");
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  const handleEmojiSelect = (emoji: string) => {
    setNewMessage((prev) => prev + emoji);
    setShowEmojiPicker(false);
  };

  const commonEmojis = [
    "😊",
    "😂",
    "👍",
    "❤️",
    "😍",
    "🤔",
    "😢",
    "😮",
    "🔥",
    "💯",
    "🎉",
    "👏",
  ];

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } else if (diffInHours < 168) {
      return `${Math.floor(diffInHours / 24)}d ago`;
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-powder-blue/20 to-bright-cyan/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div
          className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
          style={{ height: "calc(100vh - 8rem)" }}
        >
          <div className="flex h-full">
            {/* Conversations List */}
            <div
              className={`w-full md:w-1/3 border-r border-gray-100 flex flex-col ${
                selectedConversation ? "hidden md:flex" : ""
              }`}
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-pine-green to-dark-teal">
                <h1 className="text-2xl font-bold text-white mb-4">Messages</h1>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search conversations..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-bright-cyan focus:border-transparent bg-white/95 backdrop-blur-sm"
                  />
                </div>
              </div>

              {/* Conversations */}
              <div className="flex-1 overflow-y-auto bg-gray-50">
                {filteredConversations.length > 0 ? (
                  <div className="divide-y divide-gray-100">
                    {filteredConversations.map((conversation) => (
                      <button
                        key={conversation.partnerId}
                        onClick={() => {
                          setSelectedConversation(conversation);
                          loadMessages(conversation.partnerId);
                        }}
                        className={`w-full p-4 text-left hover:bg-white/80 transition-all duration-200 ${
                          selectedConversation?.partnerId ===
                          conversation.partnerId
                            ? "bg-white shadow-sm border-r-4 border-pine-green"
                            : ""
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="relative">
                            <ProfilePicture
                              src={conversation.partnerProfilePicture}
                              alt={conversation.partnerUsername}
                              size="lg"
                              className="border-2 border-white shadow-sm"
                            />
                            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="font-semibold text-gray-900 truncate">
                                {conversation.partnerUsername}
                              </h3>
                              <span className="text-xs text-gray-500">
                                {conversation.lastMessageTime &&
                                  formatTime(conversation.lastMessageTime)}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <p className="text-sm text-gray-600 truncate flex-1">
                                {conversation.lastMessage || "No messages yet"}
                              </p>
                              {conversation.unreadCount &&
                                conversation.unreadCount > 0 && (
                                  <span className="bg-burnt-sienna text-white text-xs rounded-full h-5 w-5 flex items-center justify-center ml-2">
                                    {conversation.unreadCount > 99
                                      ? "99+"
                                      : conversation.unreadCount}
                                  </span>
                                )}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full p-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-pine-green/20 to-bright-cyan/20 rounded-full flex items-center justify-center mb-6">
                      <MessageCircle className="h-10 w-10 text-pine-green" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No conversations found
                    </h3>
                    <p className="text-gray-600 text-center">
                      {searchTerm
                        ? "Try adjusting your search terms"
                        : "Start a conversation by messaging someone about their item"}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Chat Area */}
            <div
              className={`flex-1 flex flex-col ${
                !selectedConversation ? "hidden md:flex" : ""
              }`}
            >
              {selectedConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white shadow-sm">
                    <button
                      onClick={() => setSelectedConversation(null)}
                      className="md:hidden text-gray-600 hover:text-gray-900 p-2 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <ArrowLeft className="h-6 w-6" />
                    </button>

                    <div className="flex items-center space-x-3 flex-1">
                      <div className="relative">
                        <ProfilePicture
                          src={selectedConversation.partnerProfilePicture}
                          alt={selectedConversation.partnerUsername}
                          size="md"
                        />
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                      </div>
                      <div>
                        <h2 className="font-semibold text-gray-900">
                          {selectedConversation.partnerUsername}
                        </h2>
                        <p className="text-sm text-green-600 font-medium">
                          Online
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {/* Removed non-functional phone and video call buttons */}
                      <button
                        onClick={() => alert("More options coming soon!")}
                        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
                      >
                        <MoreVertical className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-gray-50 to-white">
                    {messages && messages.length > 0 ? (
                      messages
                        .sort(
                          (a, b) =>
                            new Date(a.sentTime).getTime() -
                            new Date(b.sentTime).getTime()
                        )
                        .map((message) => {
                          // Safe null checking for sender and receiver data
                          if (
                            !message ||
                            !message.sender ||
                            !message.receiver
                          ) {
                            console.warn("Invalid message data:", message);
                            return null;
                          }

                          const isCurrentUserSender =
                            message.sender.userId === user?.userId;

                          return (
                            <div
                              key={message.messageId}
                              className={`flex items-end space-x-2 ${
                                isCurrentUserSender
                                  ? "justify-end"
                                  : "justify-start"
                              }`}
                            >
                              {!isCurrentUserSender && (
                                <ProfilePicture
                                  src={message.sender.profilePicture}
                                  alt={message.sender.displayUsername || "User"}
                                  size="sm"
                                  className="flex-shrink-0"
                                />
                              )}
                              <div
                                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm ${
                                  isCurrentUserSender
                                    ? "bg-gradient-to-r from-pine-green to-dark-teal text-white rounded-br-md"
                                    : "bg-white text-gray-900 rounded-bl-md border border-gray-200"
                                }`}
                              >
                                <p className="leading-relaxed">
                                  {message.text}
                                </p>
                                <p
                                  className={`text-xs mt-2 ${
                                    isCurrentUserSender
                                      ? "text-powder-blue/80"
                                      : "text-gray-500"
                                  }`}
                                >
                                  {formatTime(message.sentTime)}
                                  {isCurrentUserSender && (
                                    <span className="ml-1">✓</span>
                                  )}
                                </p>
                              </div>
                              {isCurrentUserSender && (
                                <ProfilePicture
                                  src={user?.profilePicture}
                                  alt={user?.username || "You"}
                                  size="sm"
                                  className="flex-shrink-0"
                                />
                              )}
                            </div>
                          );
                        })
                        .filter(Boolean) // Remove null entries from invalid messages
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full">
                        <div className="w-16 h-16 bg-gradient-to-br from-pine-green/20 to-bright-cyan/20 rounded-full flex items-center justify-center mb-4">
                          <MessageCircle className="h-8 w-8 text-pine-green" />
                        </div>
                        <p className="text-gray-500 text-center">
                          No messages yet. Start the conversation!
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-gray-100 bg-white">
                    {showEmojiPicker && (
                      <div className="mb-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <div className="grid grid-cols-6 gap-2">
                          {commonEmojis.map((emoji, index) => (
                            <button
                              key={index}
                              onClick={() => handleEmojiSelect(emoji)}
                              className="text-xl hover:bg-white rounded-lg p-2 transition-colors"
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="flex items-end space-x-3">
                      <div className="flex space-x-1">
                        <button
                          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                          className={`p-2 rounded-full transition-colors ${
                            showEmojiPicker
                              ? "text-pine-green bg-powder-blue/50"
                              : "text-gray-600 hover:text-pine-green hover:bg-powder-blue/30"
                          }`}
                        >
                          <Smile className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => imageInputRef.current?.click()}
                          className="p-2 text-gray-600 hover:text-pine-green hover:bg-powder-blue/30 rounded-full transition-colors"
                        >
                          <Image className="h-5 w-5" />
                        </button>
                        <input
                          ref={imageInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleSendImage}
                        />
                      </div>
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 border border-gray-300 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-pine-green focus:border-transparent"
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                        className="bg-gradient-to-r from-pine-green to-dark-teal text-white p-3 rounded-full hover:from-dark-teal hover:to-pine-green disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center shadow-md"
                      >
                        <Send className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-powder-blue/10 to-bright-cyan/5">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-powder-blue to-bright-cyan/50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                      <MessageCircle className="h-12 w-12 text-pine-green" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Select a conversation
                    </h3>
                    <p className="text-gray-600 max-w-sm">
                      Choose a conversation from the list to start messaging
                      with your fellow students
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
