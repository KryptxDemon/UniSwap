import { useState } from "react";
import { X, Smile } from "lucide-react";
import { AvatarSelector } from "./AvatarSelector";
import { getProfilePictureUrl } from "../../utils/imageUtils";

interface AvatarPickerProps {
  currentAvatar?: string;
  onAvatarChange: (avatarId: string) => void;
  onClose: () => void;
}

export function AvatarPicker({
  currentAvatar,
  onAvatarChange,
  onClose,
}: AvatarPickerProps) {
  const [selectedAvatar, setSelectedAvatar] = useState(currentAvatar || "");
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  const [error, setError] = useState("");

  const handleAvatarSelect = (avatarId: string) => {
    setSelectedAvatar(avatarId);
    setError("");
  };

  const handleSave = () => {
    if (!selectedAvatar.trim()) {
      setError("Please select an avatar");
      return;
    }
    onAvatarChange(selectedAvatar);
    onClose();
  };

  const previewUrl = getProfilePictureUrl(selectedAvatar);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Choose Your Avatar
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Current Preview */}
        <div className="text-center mb-6">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Avatar preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-pine-green to-bright-cyan flex items-center justify-center">
                <Smile className="h-8 w-8 text-white" />
              </div>
            )}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {selectedAvatar ? "Your selected avatar" : "No avatar selected"}
          </p>
        </div>

        {/* Avatar Selector Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowAvatarSelector(true)}
            className="w-full border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg px-4 py-6 text-center hover:border-pine-green dark:hover:border-bright-cyan hover:bg-green-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Smile className="h-8 w-8 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
            <span className="text-gray-600 dark:text-gray-300">
              Choose from cool avatars
            </span>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              30+ fun & expressive options
            </div>
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-700 rounded-lg">
            <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-4">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!selectedAvatar}
            className="flex-1 bg-pine-green dark:bg-bright-cyan text-white py-3 rounded-lg font-medium hover:bg-dark-teal dark:hover:bg-pine-green disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Save Avatar
          </button>
        </div>
      </div>

      {/* Avatar Selector Modal */}
      {showAvatarSelector && (
        <AvatarSelector
          currentAvatar={selectedAvatar}
          onAvatarSelect={handleAvatarSelect}
          onClose={() => setShowAvatarSelector(false)}
        />
      )}
    </div>
  );
}
