import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { X, ImagePlus } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { demoItems } from "../lib/demoData";
import { Condition } from "../types";
import { mockCategories, mockLocations } from "../lib/mockData";

const conditions: Condition[] = ["New", "Like New", "Good", "Fair", "Poor"];
const types = ["free", "swap", "rent"];

export function PostItemPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category_id: "",
    condition: "",
    type: "",
    swap_with: "",
    location_id: "",
    department: "",
    phone: "",
    images: [] as string[],
    post_time: new Date().toISOString(),
  });

  const [selectedLocationType, setSelectedLocationType] = useState("");

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageAdd = () => {
    const input = imageInputRef.current;
    if (input && input.value.trim() && formData.images.length < 1) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, input.value.trim()],
      }));
      input.value = "";
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (formData.images.length >= 1) return;
    
    // Check file size (limit to 500KB to prevent localStorage quota issues)
    if (file.size > 500 * 1024) {
      alert("Image file size must be less than 500KB. Please compress your image and try again.");
      return;
    }
    
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      
      // Additional check for base64 size
      if (dataUrl.length > 700000) { // ~500KB in base64
        alert("Image is too large after processing. Please use a smaller image.");
        return;
      }
      
      setFormData((prev) => ({ ...prev, images: [dataUrl] }));
    };
    reader.readAsDataURL(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleImageRemove = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setError("You must be logged in to post an item");
      return;
    }

    const { title, description, category_id, condition, type, location_id, phone } =
      formData;
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
      console.log("Posting item:", formData);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newItem = {
        id: `item-${Date.now()}`,
        title,
        description,
        category: mockCategories.find((c) => c.id === category_id)!,
        condition,
        type: formData.type as "free" | "swap" | "rent",
        location: mockLocations.find((l) => l.id === location_id)!,
        department: formData.department,
        phone: formData.phone,
        images: formData.images,
        swap_with: formData.type === "swap" ? formData.swap_with : undefined,
        created_at: formData.post_time,
        user_id: user.id,
        user,
        is_exchanged: false,
      };

      try {
        const stored = localStorage.getItem("items");
        const arr = stored ? JSON.parse(stored) : [];
        arr.push(newItem);
        
        // Check if we can store the data
        const dataToStore = JSON.stringify(arr);
        if (dataToStore.length > 4.5 * 1024 * 1024) { // 4.5MB limit
          throw new Error("Storage quota exceeded");
        }
        
        localStorage.setItem("items", dataToStore);
      } catch (storageError: any) {
        if (storageError.name === 'QuotaExceededError' || storageError.message.includes('quota') || storageError.message.includes('Storage')) {
          // Clean up old items to make space
          const stored = localStorage.getItem("items");
          const arr = stored ? JSON.parse(stored) : [];
          
          // Keep only the 50 most recent items
          const recentItems = arr.slice(-49); // Keep 49 + 1 new = 50 total
          recentItems.push(newItem);
          
          localStorage.setItem("items", JSON.stringify(recentItems));
          alert("Storage was full. Older items have been removed to make space for your new item.");
        } else {
          throw storageError;
        }
      }

      const goEdit = window.confirm(
        "Item has been listed. Press OK to edit or Cancel to continue."
      );
      if (goEdit) {
        navigate(`/item/${newItem.id}`);
      } else {
        navigate("/browse");
      }
    } catch (err: any) {
      setError(err.message || "Failed to post item");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow text-center">
          <h2 className="text-2xl font-bold mb-4">Sign In Required</h2>
          <p className="text-gray-600 mb-6">
            You need to be signed in to post an item.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  const locationOptions = mockLocations.filter((location) => {
    if (selectedLocationType === "on-campus")
      return location.type === "on-campus";
    if (selectedLocationType === "off-campus")
      return location.type === "off-campus";
    return false;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Post an Item</h1>
          <p className="text-gray-600">
            Share an item with your university community
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-xl shadow space-y-6"
        >
          {error && (
            <div className="bg-red-100 text-red-700 p-4 rounded-lg">
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block font-medium mb-2">Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className="w-full border px-4 py-3 rounded-lg"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block font-medium mb-2">Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="w-full border px-4 py-3 rounded-lg"
              rows={4}
              required
            />
          </div>

          {/* Select Rows */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <SelectInput
              label="Category *"
              value={formData.category_id}
              onChange={(val) => handleInputChange("category_id", val)}
              options={mockCategories.map((c) => c.name)}
              rawOptions={mockCategories.map((c) => c.id)}
            />
            <SelectInput
              label="Condition *"
              value={formData.condition}
              onChange={(val) => handleInputChange("condition", val)}
              options={conditions}
            />
            <SelectInput
              label="Type *"
              value={formData.type}
              onChange={(val) => handleInputChange("type", val)}
              options={types.map((t) => t.charAt(0).toUpperCase() + t.slice(1))}
              rawOptions={types}
            />
          </div>

          {formData.type === "swap" && (
            <div>
              <label className="block font-medium mb-2">Swap With *</label>
              <input
                type="text"
                value={formData.swap_with}
                onChange={(e) => handleInputChange("swap_with", e.target.value)}
                className="w-full border px-4 py-3 rounded-lg"
                placeholder="e.g., a table lamp"
                required
              />
            </div>
          )}

          {/* Location */}
          <div>
            <label className="block font-medium mb-2">Location Type *</label>
            <select
              value={selectedLocationType}
              onChange={(e) => {
                setSelectedLocationType(e.target.value);
                handleInputChange("location_id", "");
              }}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-pine-green mb-4"
              required
            >
              <option value="">Select Location Type</option>
              <option value="on-campus">On Campus</option>
              <option value="off-campus">Off Campus</option>
            </select>

            <label className="block font-medium mb-2">Location *</label>
            <select
              value={formData.location_id}
              onChange={(e) => handleInputChange("location_id", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-pine-green"
              required
              disabled={!selectedLocationType}
            >
              <option value="">Select Location</option>
              {locationOptions.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name}
                </option>
              ))}
            </select>
          </div>

          {/* Department and Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-medium mb-2">
                Department (optional)
              </label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => handleInputChange("department", e.target.value)}
                className="w-full border px-4 py-3 rounded-lg"
              />
            </div>
            <div>
              <label className="block font-medium mb-2">Phone Number *</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className="w-full border px-4 py-3 rounded-lg"
                required
              />
            </div>
          </div>

          {/* Image URL Input */}
          <div>
            <label className="block font-medium mb-2">Image (one only)</label>
            <p className="text-sm text-gray-600 mb-3">
              For uploaded files: Maximum size 500KB to prevent storage issues. Use image compression tools if needed.
            </p>
            <div className="flex gap-2 mb-2">
              <input
                type="url"
                ref={imageInputRef}
                placeholder="Paste Google Drive or image URL here..."
                className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-pine-green"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleImageAdd();
                  }
                }}
              />
              <button
                type="button"
                onClick={handleImageAdd}
                disabled={formData.images.length >= 1}
                className="bg-pine-green text-white px-4 py-3 rounded-lg hover:bg-dark-teal flex items-center gap-2"
              >
                <ImagePlus className="h-5 w-5" />
                Add
              </button>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileSelect}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={formData.images.length >= 1}
                className="bg-gray-100 px-4 py-3 rounded-lg hover:bg-gray-200"
              >
                Upload from PC (≤500KB)
              </button>
            </div>

            {formData.images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {formData.images.map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      className="w-full h-32 object-cover rounded-lg border"
                    />
                    <button
                      type="button"
                      onClick={() => handleImageRemove(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate("/browse")}
              className="flex-1 bg-gray-100 py-3 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-pine-green text-white py-3 rounded-lg hover:bg-dark-teal disabled:opacity-50"
            >
              {loading ? "Posting..." : "Post Item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function SelectInput({
  label,
  value,
  onChange,
  options,
  rawOptions,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  options: string[];
  rawOptions?: string[];
}) {
  const actualOptions = rawOptions ?? options;
  return (
    <div>
      <label className="block font-medium mb-2">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border px-4 py-3 rounded-lg"
        required
      >
        <option value="">Select</option>
        {actualOptions.map((opt, i) => (
          <option key={opt} value={rawOptions ? rawOptions[i] : opt}>
            {options[i]}
          </option>
        ))}
      </select>
    </div>
  );
}
