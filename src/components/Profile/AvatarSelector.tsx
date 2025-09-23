import { useState } from "react";
import { AVATAR_CATEGORIES, getAvatarsByCategory } from "../../utils/avatars";
import { createEmojiDataUrl } from "../../utils/imageUtils";

interface AvatarSelectorProps {
  currentAvatar?: string;
  onAvatarSelect: (avatarId: string) => void;
  onClose: () => void;
}

export function AvatarSelector({
  currentAvatar,
  onAvatarSelect,
  onClose,
}: AvatarSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [hoveredAvatar, setHoveredAvatar] = useState<string | null>(null);
  const [selectedAvatar, setSelectedAvatar] = useState(currentAvatar || "");

  const filteredAvatars = getAvatarsByCategory(selectedCategory);

  const handleAvatarClick = (avatarId: string) => {
    setSelectedAvatar(avatarId);
    onAvatarSelect(avatarId);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Choose Your Avatar
            </h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl font-bold"
            >
              ×
            </button>
          </div>

          {/* Category filters */}
          <div className="flex space-x-2 mt-4">
            {AVATAR_CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 ${
                  selectedCategory === category.id
                    ? "bg-pine-green text-white dark:bg-bright-cyan"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                }`}
              >
                <span>{category.icon}</span>
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Avatar Grid */}
        <div className="p-6 overflow-y-auto max-h-96">
          <div className="grid grid-cols-6 gap-3">
            {filteredAvatars.map((avatar) => (
              <button
                key={avatar.id}
                onClick={() => handleAvatarClick(avatar.id)}
                onMouseEnter={() => setHoveredAvatar(avatar.id)}
                onMouseLeave={() => setHoveredAvatar(null)}
                className={`relative group p-3 rounded-xl transition-all duration-200 ${
                  selectedAvatar === avatar.id
                    ? "bg-pine-green dark:bg-bright-cyan shadow-lg ring-2 ring-pine-green dark:ring-bright-cyan"
                    : "bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600"
                } ${hoveredAvatar === avatar.id ? "scale-105" : ""}`}
                title={avatar.name}
              >
                <div className="w-12 h-12 mx-auto flex items-center justify-center">
                  <img
                    src={createEmojiDataUrl(avatar.emoji)}
                    alt={avatar.name}
                    className="w-10 h-10 rounded-full"
                  />
                </div>

                {/* Selection indicator */}
                {selectedAvatar === avatar.id && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-pine-green dark:bg-bright-cyan rounded-full"></div>
                  </div>
                )}

                {/* Hover tooltip */}
                {hoveredAvatar === avatar.id && (
                  <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                    {avatar.name}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Choose an avatar that represents you!
            </p>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 text-gray-700 hover:bg-gray-400 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (selectedAvatar) {
                    onAvatarSelect(selectedAvatar);
                    onClose();
                  }
                }}
                disabled={!selectedAvatar}
                className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed dark:bg-blue-500 dark:hover:bg-blue-600 dark:disabled:bg-gray-600 rounded-lg transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
