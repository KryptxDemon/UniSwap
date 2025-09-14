import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { mockCategories, mockLocations } from "../lib/mockData";
import { itemAPI } from "../services/apiService";
import { uploadAPI } from "../services/uploadService";

export function PostItemPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category_id: "",
    condition: "",
    type: "",
    location_id: "",
    phone: "",
    image: null as File | null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setError("You must be logged in to post an item");
      return;
    }

    const {
      title,
      description,
      category_id,
      condition,
      type,
      location_id,
      phone,
    } = formData;

    if (
      !title ||
      !description ||
      !category_id ||
      !condition ||
      !type ||
      !location_id ||
      !phone
    ) {
      setError("Please fill in all required fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      let imageUrl = "";

      if (formData.image) {
        imageUrl = await uploadAPI.uploadImage(formData.image);
      }

      const postData = {
        itemName: title,
        description,
        itemType: type,
        itemCondition: condition,
        status: "available",
        phone,
        postDate: new Date().toISOString().split("T")[0],
        categoryId: parseInt(category_id),
        locationId: parseInt(location_id),
        post: {
          imageUrls: imageUrl,
          postTime: new Date().toISOString(),
        },
      };

      await itemAPI.createItem(postData);
      alert("Item posted successfully!");
      navigate("/browse");
    } catch (error: any) {
      console.error("Error:", error);
      setError(error.response?.data?.message || "Failed to post item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-8">
        <h1 className="text-2xl font-bold mb-6">Post New Item</h1>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                value={formData.category_id}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    category_id: e.target.value,
                  }))
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                required
              >
                <option value="">Select category</option>
                {mockCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Condition *
              </label>
              <select
                value={formData.condition}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    condition: e.target.value,
                  }))
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                required
              >
                <option value="">Select condition</option>
                <option value="New">New</option>
                <option value="Like New">Like New</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
                <option value="Poor">Poor</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type *
              </label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, type: e.target.value }))
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                required
              >
                <option value="">Select type</option>
                <option value="free">Free</option>
                <option value="swap">Swap</option>
                <option value="rent">Rent</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location *
              </label>
              <select
                value={formData.location_id}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    location_id: e.target.value,
                  }))
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                required
              >
                <option value="">Select location</option>
                {mockLocations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone *
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, phone: e.target.value }))
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  image: e.target.files?.[0] || null,
                }))
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
            {formData.image && (
              <p className="text-sm text-gray-600 mt-1">
                Selected: {formData.image.name}
              </p>
            )}
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate("/browse")}
              className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
            >
              {loading ? (
                <Loader className="animate-spin h-5 w-5" />
              ) : (
                "Post Item"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
