import React, { useRef, useState } from "react";
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
import { Conversation, Message } from "../types";

export function MessagesPage() {
  const { user } = useAuth();
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  // load conversations from storage
  const persistedConvs = (() => {
    try {
      const ls = localStorage.getItem("conversations");
      return ls ? (JSON.parse(ls) as Conversation[]) : [];
    } catch {
      return [] as Conversation[];
    }
  })();
  const mergedConversations = persistedConvs;

  const filteredConversations = mergedConversations.filter(
    (conv) =>
      conv.other_user?.username
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      conv.item?.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isSendingRef = useRef(false);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;
    if (isSendingRef.current) return;
    
    isSendingRef.current = true;
    const messageContent = newMessage.trim();
    
    // Clear input immediately to prevent duplicate sends
    setNewMessage("");

    console.log("Sending message:", messageContent);

    const newMsg: Message = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      content: messageContent,
      sender_id: user?.id || "",
      receiver_id: selectedConversation.other_user?.id || "",
      conversation_id: selectedConversation.id,
      item_id: selectedConversation.item_id,
      created_at: new Date().toISOString(),
      sender: user || undefined,
      receiver: selectedConversation.other_user,
      read: false,
      message_type: "text",
    };

    try {
      const lsMsgs = localStorage.getItem("messages");
      const persistedMsgs = lsMsgs ? (JSON.parse(lsMsgs) as Message[]) : [];
      
      // Check if message already exists to prevent duplicates
      const messageExists = persistedMsgs.some(msg => 
        msg.content === messageContent && 
        msg.sender_id === user?.id && 
        msg.conversation_id === selectedConversation.id &&
        Math.abs(new Date(msg.created_at).getTime() - new Date().getTime()) < 5000 // within 5 seconds
      );
      
      if (!messageExists) {
        persistedMsgs.push(newMsg);
        localStorage.setItem("messages", JSON.stringify(persistedMsgs));

        // update conversation preview in storage
        const convsRaw = localStorage.getItem("conversations");
        const conversations: Conversation[] = convsRaw
          ? JSON.parse(convsRaw)
          : [];
        const idx = conversations.findIndex(
          (c) => c.id === selectedConversation.id
        );
        if (idx !== -1) {
          conversations[idx].last_message = messageContent;
          conversations[idx].last_message_at = new Date().toISOString();
          conversations[idx].updated_at = new Date().toISOString();
          localStorage.setItem("conversations", JSON.stringify(conversations));
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      // Reset the sending flag after a short delay
      setTimeout(() => {
        isSendingRef.current = false;
      }, 1000);
    }
  };

  const imageInputRef = useRef<HTMLInputElement | null>(null);

  const handleSendImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedConversation) return;
    const reader = new FileReader();
    reader.onload = () => {
      const newMsg: Message = {
        id: `msg-${Date.now()}`,
        content: String(reader.result || ""),
        sender_id: user?.id || "",
        receiver_id: selectedConversation.other_user?.id || "",
        conversation_id: selectedConversation.id,
        item_id: selectedConversation.item_id,
        created_at: new Date().toISOString(),
        sender: user || undefined,
        receiver: selectedConversation.other_user,
        read: false,
        message_type: "image" as any,
      };
      try {
        const lsMsgs = localStorage.getItem("messages");
        const persistedMsgs = lsMsgs ? (JSON.parse(lsMsgs) as Message[]) : [];
        persistedMsgs.push(newMsg);
        localStorage.setItem("messages", JSON.stringify(persistedMsgs));

        const convsRaw = localStorage.getItem("conversations");
        const conversations: Conversation[] = convsRaw
          ? JSON.parse(convsRaw)
          : [];
        const idx = conversations.findIndex(
          (c) => c.id === selectedConversation.id
        );
        if (idx !== -1) {
          conversations[idx].last_message = "[Image]";
          conversations[idx].last_message_at = new Date().toISOString();
          conversations[idx].updated_at = new Date().toISOString();
          localStorage.setItem("conversations", JSON.stringify(conversations));
        }
      } catch {}
      if (imageInputRef.current) imageInputRef.current.value = "";
    };
    reader.readAsDataURL(file);
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
                        key={conversation.id}
                        onClick={() => setSelectedConversation(conversation)}
                        className={`w-full p-4 text-left hover:bg-white/80 transition-all duration-200 ${
                          selectedConversation?.id === conversation.id
                            ? "bg-white shadow-sm border-r-4 border-pine-green"
                            : ""
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 relative">
                            {conversation.other_user?.profile_picture ? (
                              <img
                                src={conversation.other_user.profile_picture}
                                alt={conversation.other_user.username}
                                className="w-full h-full object-cover rounded-full border-2 border-white shadow-sm"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-pine-green to-bright-cyan rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                                <span className="text-white font-semibold">
                                  {conversation.other_user?.username
                                    .charAt(0)
                                    .toUpperCase()}
                                </span>
                              </div>
                            )}
                            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="font-semibold text-gray-900 truncate">
                                {conversation.other_user?.username}
                              </h3>
                              <span className="text-xs text-gray-500">
                                {conversation.last_message_at &&
                                  formatTime(conversation.last_message_at)}
                              </span>
                            </div>
                            {conversation.item && (
                              <p className="text-sm text-pine-green mb-1 truncate font-medium">
                                Re: {conversation.item.title}
                              </p>
                            )}
                            <div className="flex items-center justify-between">
                              <p className="text-sm text-gray-600 truncate flex-1">
                                {conversation.last_message || "No messages yet"}
                              </p>
                              <div className="w-2 h-2 bg-bright-cyan rounded-full ml-2"></div>
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
                      <div className="w-10 h-10 rounded-full flex items-center justify-center relative">
                        {selectedConversation.other_user?.profile_picture ? (
                          <img
                            src={
                              selectedConversation.other_user.profile_picture
                            }
                            alt={selectedConversation.other_user.username}
                            className="w-full h-full object-cover rounded-full border-2 border-gray-100"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-pine-green to-bright-cyan rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold">
                              {selectedConversation.other_user?.username
                                .charAt(0)
                                .toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                      </div>
                      <div>
                        <h2 className="font-semibold text-gray-900">
                          {selectedConversation.other_user?.username}
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

                  {/* Item Context */}
                  {selectedConversation.item && (
                    <div className="px-6 py-4 bg-gradient-to-r from-powder-blue/30 to-bright-cyan/20 border-b border-bright-cyan/20">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-pine-green/20 rounded-lg flex items-center justify-center">
                          <MessageCircle className="h-4 w-4 text-pine-green" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-pine-green">
                            Discussing: {selectedConversation.item.title}
                          </p>
                          <p className="text-xs text-dark-teal">
                            {selectedConversation.item.type
                              .charAt(0)
                              .toUpperCase() +
                              selectedConversation.item.type.slice(1)}{" "}
                            • {selectedConversation.item.location.name}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-gray-50 to-white">
                    {(() => {
                      try {
                        const ls = localStorage.getItem("messages");
                        return ls ? (JSON.parse(ls) as Message[]) : [];
                      } catch {
                        return [] as Message[];
                      }
                    })()
                      .filter(
                        (msg) => msg.conversation_id === selectedConversation.id
                      )
                      .sort(
                        (a, b) =>
                          new Date(a.created_at).getTime() -
                          new Date(b.created_at).getTime()
                      )
                      .map((message) => {
                        // Ensure sender info is populated
                        const isCurrentUserSender = message.sender_id === (user?.id || "");
                        const senderInfo = isCurrentUserSender 
                          ? user 
                          : selectedConversation?.other_user;
                        
                        return (
                        <div
                          key={message.id}
                          className={`flex items-end space-x-2 ${
                            message.sender_id === (user?.id || "")
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
                          {message.sender_id !== (user?.id || "") && (
                            <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                              {senderInfo?.profile_picture ? (
                                <img
                                  src={senderInfo.profile_picture}
                                  alt={senderInfo.username}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-pine-green to-bright-cyan rounded-full flex items-center justify-center">
                                  <span className="text-white text-xs font-semibold">
                                    {senderInfo?.username
                                      ?.charAt(0)
                                      .toUpperCase()}
                                  </span>
                                </div>
                              )}
                            </div>
                          )}
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm ${
                              message.sender_id === (user?.id || "")
                                ? "bg-gradient-to-r from-pine-green to-dark-teal text-white rounded-br-md"
                                : "bg-white text-gray-900 rounded-bl-md border border-gray-200"
                            }`}
                          >
                            {message.message_type === ("image" as any) ? (
                              <img
                                src={message.content}
                                alt="sent"
                                className="rounded-lg max-w-full h-auto"
                              />
                            ) : (
                              <p className="leading-relaxed">
                                {message.content}
                              </p>
                            )}
                            <p
                              className={`text-xs mt-2 ${
                                message.sender_id === (user?.id || "")
                                  ? "text-powder-blue/80"
                                  : "text-gray-500"
                              }`}
                            >
                              {formatTime(message.created_at)}
                              {message.sender_id === (user?.id || "") && (
                                <span className="ml-1">
                                  {message.read ? "✓✓" : "✓"}
                                </span>
                              )}
                            </p>
                          </div>
                          {message.sender_id === (user?.id || "") && (
                            <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                              {user?.profile_picture ? (
                                <img
                                  src={user.profile_picture}
                                  alt={user.username}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-pine-green to-bright-cyan rounded-full flex items-center justify-center">
                                  <span className="text-white text-xs font-semibold">
                                    {user?.username
                                      ? user.username.charAt(0).toUpperCase()
                                      : ""}
                                  </span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        );
                      })}
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
