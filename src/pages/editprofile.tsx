import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Edit3, X } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

interface EditProfilePageProps {
  userId: string;
}

export function EditProfilePage({ userId }: EditProfilePageProps) {
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const user =
    authUser ||
    ({ id: userId, username: "", bio: "", profile_picture: "" } as any);

  const [username, setUsername] = useState(user.username);
  const [bio, setBio] = useState(user.bio || "");
  const [profilePic, setProfilePic] = useState(user.profile_picture);

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfilePic(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Normally: save updated user info to backend or global state
    // For demo, just navigate back or show success message
    navigate(`/profile/${userId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 flex justify-center">
      <div className="bg-white rounded-3xl shadow-lg p-10 w-full max-w-xl">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8 flex items-center space-x-3">
          <Edit3 className="h-7 w-7 text-blue-600" />
          <span>Edit Profile</span>
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex flex-col items-center">
            <div className="relative">
              <img
                src={profilePic}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-8 border-pine-green shadow-md"
              />
              <label className="absolute bottom-2 right-2 bg-pine-green text-white rounded-full p-3 cursor-pointer hover:bg-dark-teal transition shadow-lg">
                <Edit3 className="h-5 w-5" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleProfilePicChange}
                />
              </label>
            </div>
          </div>

          <div>
            <label
              className="block text-gray-700 font-semibold mb-2"
              htmlFor="username"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pine-green transition"
              maxLength={30}
            />
          </div>

          <div>
            <label
              className="block text-gray-700 font-semibold mb-2"
              htmlFor="bio"
            >
              Bio
            </label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              placeholder="Tell us something about yourself..."
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pine-green transition resize-none"
              maxLength={250}
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate(`/profile/${userId}`)}
              className="px-6 py-3 rounded-xl bg-gray-200 text-gray-700 hover:bg-gray-300 transition font-semibold flex items-center space-x-2"
            >
              <X className="h-5 w-5" />
              <span>Cancel</span>
            </button>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-pine-green text-white hover:bg-dark-teal transition font-semibold"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
