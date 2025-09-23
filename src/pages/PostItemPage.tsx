import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Loader, AlertCircle } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { mockCategories, mockLocations } from "../lib/mockData";
import { itemAPI } from "../services/apiService";
import { uploadAPI } from "../services/uploadService";

export function PostItemPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams(); // Get item ID from URL for editing
  const [loading, setLoading] = useState(false);
  const [loadingItem, setLoadingItem] = useState(false);
  const [error, setError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category_id: "",
    condition: "",
    type: "",
    locationType: "",
    location_id: "",
    phone: "+880",
    swapWith: "",
    imageUrl: "", // Store uploaded file URL instead of base64
  });

  const [uploadPreviewUrl, setUploadPreviewUrl] = useState(""); // For instant preview using URL.createObjectURL

  const validatePhoneNumber = (phone: string) => {
    const phoneWithoutPrefix = phone.replace("+880", "").trim();
    if (phoneWithoutPrefix.length !== 10) {
      setPhoneError(
        "Please enter a complete 10-digit phone number (e.g., +880 1613732227)"
      );
      return false;
    }
    setPhoneError("");
    return true;
  };

  // Load existing item data for editing
  useEffect(() => {
    if (isEditing && id) {
      const loadItemData = async () => {
        setLoadingItem(true);
        try {
          const item = await itemAPI.getItemById(parseInt(id));
          setFormData({
            title: item.title || "",
            description: item.description || "",
            category_id: item.category?.id || "",
            condition: item.condition || "",
            type: item.type || "",
            locationType: item.location?.type || "",
            location_id: item.location?.id || "",
            phone: item.phone || "+880",
            swapWith: item.swapWith || "",
            imageUrl: item.images?.[0] || "",
          });
          // Don't set uploadPreviewUrl for existing items
          // uploadPreviewUrl is only for newly uploaded files
        } catch (error) {
          console.error("Error loading item:", error);
          setError("Failed to load item data");
        } finally {
          setLoadingItem(false);
        }
      };
      loadItemData();
    }
  }, [id, isEditing]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB for file upload)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size must be less than 5MB");
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file");
        return;
      }

      // Show instant preview using URL.createObjectURL
      const instantPreview = URL.createObjectURL(file);
      setUploadPreviewUrl(instantPreview);
      setError("");

      try {
        setLoading(true);
        const imageUrl = await uploadAPI.uploadImage(file);
        setFormData((prev) => ({ ...prev, imageUrl }));
        // Clean up the object URL after successful upload
        URL.revokeObjectURL(instantPreview);
        setUploadPreviewUrl("");
      } catch (error) {
        console.error("Upload error:", error);
        setError("Failed to upload image");
        // Clean up on error
        URL.revokeObjectURL(instantPreview);
        setUploadPreviewUrl("");
      } finally {
        setLoading(false);
      }
    }
  };

  const handlePhoneChange = (value: string) => {
    if (!value.startsWith("+880")) {
      value = "+880" + value.replace("+880", "");
    }
    setFormData((prev) => ({ ...prev, phone: value }));
    validatePhoneNumber(value);
  };

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
      swapWith,
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

    if (!validatePhoneNumber(phone)) {
      setError("Please enter a valid phone number");
      return;
    }

    if (type === "swap" && !swapWith) {
      setError("Please specify what you want to swap with");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const postData = {
        itemName: title,
        description,
        itemType: type,
        itemCondition: condition,
        status: "available",
        phone,
        swapWith: type === "swap" ? swapWith : "",
        department: "CSE", // Default for now
        postDate: new Date().toISOString().split("T")[0], // Send only date part (YYYY-MM-DD)
        category: category_id, // Send as string now
        location: location_id, // Send as string now
        imageData: formData.imageUrl, // Use uploaded file URL
      };

      console.log("Payload:", postData);

      if (isEditing && id) {
        // Update existing item
        await itemAPI.updateItem(parseInt(id), postData);
        alert("Item updated successfully!");
        navigate(`/item/${id}`);
      } else {
        // Create new item
        await itemAPI.createItem(postData);
        alert("Item posted successfully!");
        navigate("/browse");
      }
    } catch (error: any) {
      console.error("Error:", error);
      setError(
        error.response?.data?.message ||
          `Failed to ${isEditing ? "update" : "post"} item`
      );
    } finally {
      setLoading(false);
    }
  };

  const getAvailableLocations = () => {
    return mockLocations.filter((location) => {
      if (formData.locationType === "on-campus")
        return location.type === "on-campus";
      if (formData.locationType === "off-campus")
        return location.type === "off-campus";
      return false; // Return empty array if no location type is selected
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-8">
        {loadingItem ? (
          <div className="text-center py-8">
            <Loader className="animate-spin h-8 w-8 mx-auto mb-4" />
            <p>Loading item data...</p>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold mb-6">
              {isEditing ? "Edit Item" : "Post New Item"}
            </h1>

            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
                {error}
              </div>
            )}

            {isEditing && (
              <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-lg mb-6">
                <h4 className="font-medium mb-2">📝 Editing Limitations</h4>
                <div className="text-sm space-y-1">
                  <p>
                    <strong>✅ You can edit:</strong> Title, description,
                    condition, phone number, swap preferences, and images
                  </p>
                  <p>
                    <strong>🚫 Cannot be changed:</strong> Category, item type
                    (free/swap/rent), and location
                  </p>
                  <p className="text-blue-600 mt-2">
                    These restrictions help maintain the integrity of your
                    listing and prevent confusion for interested users.
                  </p>
                </div>
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
                  placeholder="What are you posting?"
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
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 h-24"
                  placeholder="Describe your item..."
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                    {isEditing && (
                      <span className="text-xs text-gray-500 ml-2">
                        (Cannot be changed)
                      </span>
                    )}
                  </label>
                  <select
                    value={formData.category_id}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        category_id: e.target.value,
                      }))
                    }
                    className={`w-full border border-gray-300 rounded-lg px-3 py-2 ${
                      isEditing ? "bg-gray-100 cursor-not-allowed" : ""
                    }`}
                    required
                    disabled={isEditing}
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
                    <option value="new">New</option>
                    <option value="like-new">Like New</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                    <option value="poor">Poor</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type *
                  {isEditing && (
                    <span className="text-xs text-gray-500 ml-2">
                      (Cannot be changed)
                    </span>
                  )}
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      type: e.target.value,
                      swapWith: e.target.value === "swap" ? prev.swapWith : "",
                    }));
                  }}
                  className={`w-full border border-gray-300 rounded-lg px-3 py-2 ${
                    isEditing ? "bg-gray-100 cursor-not-allowed" : ""
                  }`}
                  required
                  disabled={isEditing}
                >
                  <option value="">Select type</option>
                  <option value="free">Free</option>
                  <option value="swap">Swap</option>
                  <option value="rent">Rent</option>
                </select>

                {formData.type === "rent" && (
                  <div className="mt-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-start">
                      <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
                      <div className="text-sm text-yellow-800">
                        <strong>Caution:</strong> Rental transactions are not
                        monitored by UniSwap. Please exercise caution and
                        establish clear rental terms, payment methods, and
                        return conditions with the other party. Meet in safe,
                        public locations and consider having witnesses for
                        valuable items.
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {formData.type === "swap" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Swap With *
                  </label>
                  <textarea
                    value={formData.swapWith}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        swapWith: e.target.value,
                      }))
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 h-20"
                    placeholder="What are you looking for in return? Be specific about preferred items, conditions, or requirements..."
                    required={formData.type === "swap"}
                  />
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location Type *
                    {isEditing && (
                      <span className="text-xs text-gray-500 ml-2">
                        (Cannot be changed)
                      </span>
                    )}
                  </label>
                  <select
                    value={formData.locationType}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        locationType: e.target.value,
                        location_id: "", // Reset location when type changes
                      }));
                    }}
                    className={`w-full border border-gray-300 rounded-lg px-3 py-2 ${
                      isEditing ? "bg-gray-100 cursor-not-allowed" : ""
                    }`}
                    required
                    disabled={isEditing}
                  >
                    <option value="">Select location type</option>
                    <option value="on-campus">On Campus</option>
                    <option value="off-campus">Off Campus</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location *
                    {isEditing && (
                      <span className="text-xs text-gray-500 ml-2">
                        (Cannot be changed)
                      </span>
                    )}
                  </label>
                  <select
                    value={formData.location_id}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        location_id: e.target.value,
                      }))
                    }
                    className={`w-full border border-gray-300 rounded-lg px-3 py-2 ${
                      isEditing ? "bg-gray-100 cursor-not-allowed" : ""
                    }`}
                    required
                    disabled={isEditing || !formData.locationType}
                  >
                    <option value="">
                      {formData.locationType
                        ? "Select location"
                        : "Select location type first"}
                    </option>
                    {getAvailableLocations().map((loc) => (
                      <option key={loc.id} value={loc.id}>
                        {loc.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  className={`w-full border rounded-lg px-3 py-2 ${
                    phoneError ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="+880 1613732227"
                  required
                />
                {phoneError && (
                  <div className="mt-2 text-sm text-red-600">{phoneError}</div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image (Optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
                {(uploadPreviewUrl || formData.imageUrl) && (
                  <div className="mt-3">
                    {uploadPreviewUrl && (
                      <div className="mb-3">
                        <p className="text-sm text-blue-600 mb-2">
                          Upload Preview ⏳
                        </p>
                        <img
                          src={uploadPreviewUrl}
                          alt="Upload Preview"
                          className="w-32 h-32 object-cover rounded-lg border border-blue-200"
                        />
                      </div>
                    )}

                    {formData.imageUrl && !uploadPreviewUrl && (
                      <div className="mb-3">
                        <p className="text-sm text-green-600 mb-2">
                          Current Image ✓
                        </p>
                        <img
                          src={
                            formData.imageUrl.startsWith("http")
                              ? formData.imageUrl
                              : `${
                                  import.meta.env.VITE_API_BASE_URL ||
                                  "http://localhost:8080"
                                }${formData.imageUrl}`
                          }
                          alt="Current Image"
                          className="w-32 h-32 object-cover rounded-lg border border-green-200"
                          onError={(e) => {
                            console.error(
                              "Failed to load image:",
                              formData.imageUrl
                            );
                            const target = e.target as HTMLImageElement;
                            target.style.display = "none";
                          }}
                        />
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        if (uploadPreviewUrl) {
                          URL.revokeObjectURL(uploadPreviewUrl);
                          setUploadPreviewUrl("");
                        }
                        setFormData((prev) => ({ ...prev, imageUrl: "" }));
                      }}
                      className="mt-2 text-sm text-red-600 hover:text-red-800"
                    >
                      Remove image
                    </button>
                  </div>
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
                  ) : isEditing ? (
                    "Update Item"
                  ) : (
                    "Post Item"
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
