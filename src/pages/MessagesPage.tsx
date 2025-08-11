import React, { useState } from 'react';
import { MessageCircle, Search, Send, ArrowLeft, Phone, Video, MoreVertical, Smile, Paperclip, Image } from 'lucide-react';
import { demoConversations, demoMessages, currentUser } from '../lib/demoData';
import { Conversation, Message } from '../types';

export function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const filteredConversations = demoConversations.filter(conv =>
    conv.other_user?.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.item?.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;
    
    // In a real app, this would send the message to the backend
    console.log('Sending message:', newMessage);
    
    // Create a new message object
    const newMsg: Message = {
      id: String(demoMessages.length + 1),
      content: newMessage,
      sender_id: currentUser.id,
      receiver_id: selectedConversation.other_user?.id || '',
      conversation_id: selectedConversation.id,
      item_id: selectedConversation.item_id,
      created_at: new Date().toISOString(),
      sender: currentUser,
      receiver: selectedConversation.other_user,
      read: false,
      message_type: 'text',
    };
    
    // Add to demo messages
    demoMessages.push(newMsg);
    
    // Update conversation
    const convIndex = demoConversations.findIndex(c => c.id === selectedConversation.id);
    if (convIndex !== -1) {
      demoConversations[convIndex].last_message = newMessage;
      demoConversations[convIndex].last_message_at = new Date().toISOString();
      demoConversations[convIndex].updated_at = new Date().toISOString();
    }
    
    setNewMessage('');
  };

  const handleEmojiSelect = (emoji: string) => {
    setNewMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const commonEmojis = ['😊', '😂', '👍', '❤️', '😍', '🤔', '😢', '😮', '🔥', '💯', '🎉', '👏'];

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    } else if (diffInHours < 168) { // 7 days
      return `${Math.floor(diffInHours / 24)}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden" style={{ height: 'calc(100vh - 8rem)' }}>
          <div className="flex h-full">
            {/* Conversations List */}
            <div className={`w-full md:w-1/3 border-r border-gray-200 flex flex-col ${selectedConversation ? 'hidden md:flex' : ''}`}>
              {/* Header */}
              <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Messages</h1>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search conversations..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Conversations */}
              <div className="flex-1 overflow-y-auto">
                {filteredConversations.length > 0 ? (
                  <div className="divide-y divide-gray-100">
                    {filteredConversations.map((conversation) => (
                      <button
                        key={conversation.id}
                        onClick={() => setSelectedConversation(conversation)}
                        className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                          selectedConversation?.id === conversation.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 relative">
                            {conversation.other_user?.profile_picture ? (
                              <img
                                src={conversation.other_user.profile_picture}
                                alt={conversation.other_user.username}
                                className="w-full h-full object-cover rounded-full"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                <span className="text-white font-semibold">
                                  {conversation.other_user?.username.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            )}
                            {/* Online indicator */}
                            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="font-semibold text-gray-900 truncate">
                                {conversation.other_user?.username}
                              </h3>
                              <span className="text-xs text-gray-500">
                                {conversation.last_message_at && formatTime(conversation.last_message_at)}
                              </span>
                            </div>
                            {conversation.item && (
                              <p className="text-sm text-blue-600 mb-1 truncate">
                                Re: {conversation.item.title}
                              </p>
                            )}
                            <div className="flex items-center justify-between">
                              <p className="text-sm text-gray-600 truncate flex-1">
                                {conversation.last_message || 'No messages yet'}
                              </p>
                              {/* Unread indicator */}
                              <div className="w-2 h-2 bg-blue-500 rounded-full ml-2"></div>
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full p-8">
                    <MessageCircle className="h-16 w-16 text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No conversations found</h3>
                    <p className="text-gray-600 text-center">
                      {searchTerm ? 'Try adjusting your search terms' : 'Start a conversation by messaging someone about their item'}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Chat Area */}
            <div className={`flex-1 flex flex-col ${!selectedConversation ? 'hidden md:flex' : ''}`}>
              {selectedConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white shadow-sm">
                    <button
                      onClick={() => setSelectedConversation(null)}
                      className="md:hidden text-gray-600 hover:text-gray-900"
                    >
                      <ArrowLeft className="h-6 w-6" />
                    </button>
                    
                    <div className="flex items-center space-x-3 flex-1">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center relative">
                        {selectedConversation.other_user?.profile_picture ? (
                          <img
                            src={selectedConversation.other_user.profile_picture}
                            alt={selectedConversation.other_user.username}
                            className="w-full h-full object-cover rounded-full"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold">
                              {selectedConversation.other_user?.username.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                      </div>
                      <div>
                        <h2 className="font-semibold text-gray-900">
                          {selectedConversation.other_user?.username}
                        </h2>
                        <p className="text-sm text-green-600">Online</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
                        <Phone className="h-5 w-5" />
                      </button>
                      <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
                        <Video className="h-5 w-5" />
                      </button>
                      <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-full transition-colors">
                        <MoreVertical className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  {/* Item Context */}
                  {selectedConversation.item && (
                    <div className="px-6 py-3 bg-blue-50 border-b border-blue-100">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <MessageCircle className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-blue-900">
                            Discussing: {selectedConversation.item.title}
                          </p>
                          <p className="text-xs text-blue-700">
                            {selectedConversation.item.type.charAt(0).toUpperCase() + selectedConversation.item.type.slice(1)} • {selectedConversation.item.location}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
                    {demoMessages
                      .filter(msg => 
                        msg.conversation_id === selectedConversation.id
                      )
                      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
                      .map((message) => (
                        <div
                          key={message.id}
                          className={`flex items-end space-x-2 ${message.sender_id === currentUser.id ? 'justify-end' : 'justify-start'}`}
                        >
                          {message.sender_id !== currentUser.id && (
                            <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
                              {message.sender?.profile_picture ? (
                                <img
                                  src={message.sender.profile_picture}
                                  alt={message.sender.username}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                  <span className="text-white text-xs font-semibold">
                                    {message.sender?.username.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                              )}
                            </div>
                          )}
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm ${
                              message.sender_id === currentUser.id
                                ? 'bg-blue-600 text-white rounded-br-md'
                                : 'bg-white text-gray-900 rounded-bl-md border border-gray-200'
                            }`}
                          >
                            <p className="leading-relaxed">{message.content}</p>
                            <p className={`text-xs mt-2 ${
                              message.sender_id === currentUser.id ? 'text-blue-100' : 'text-gray-500'
                            }`}>
                              {formatTime(message.created_at)}
                              {message.sender_id === currentUser.id && (
                                <span className="ml-1">{message.read ? '✓✓' : '✓'}</span>
                              )}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-gray-200 bg-white">
                    {showEmojiPicker && (
                      <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                        <div className="grid grid-cols-6 gap-2">
                          {commonEmojis.map((emoji, index) => (
                            <button
                              key={index}
                              onClick={() => handleEmojiSelect(emoji)}
                              className="text-xl hover:bg-gray-200 rounded p-1 transition-colors"
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
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                        >
                          <Smile className="h-5 w-5" />
                        </button>
                        <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
                          <Paperclip className="h-5 w-5" />
                        </button>
                        <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
                          <Image className="h-5 w-5" />
                        </button>
                      </div>
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 border border-gray-300 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                        className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                      >
                        <Send className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-gray-50 to-blue-50">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <MessageCircle className="h-12 w-12 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Select a conversation</h3>
                    <p className="text-gray-600 max-w-sm">Choose a conversation from the list to start messaging with your fellow students</p>
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