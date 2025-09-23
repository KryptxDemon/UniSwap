import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { mockLocations } from "../lib/mockData";
import { tuitionAPI } from "../services/apiService";

export function PostTuitionPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedLocationType, setSelectedLocationType] = useState("");
  const addressInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location_id: "",
    department: "",
    salary: "",
    days_week: "",
    class: "",
    subject: "",
    address_url: "",
    preferred_tutor: "both", // male | female | both
    phone: "",
    post_time: new Date().toISOString(),
    canSwap: false,
    swapDetails: "",
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddressSet = () => {
    const input = addressInputRef.current;
    if (input && input.value.trim()) {
      setFormData((prev) => ({ ...prev, address_url: input.value.trim() }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setError("You must be logged in to post a tuition offer");
      return;
    }

    const {
      title,
      description,
      location_id,
      salary,
      days_week,
      class: cls,
      subject,
      phone,
      canSwap,
      swapDetails,
    } = formData;

    if (
      !title ||
      !description ||
      !location_id ||
      !salary ||
      !days_week ||
      !cls ||
      !subject ||
      !phone
    ) {
      setError("Please fill in all required fields");
      return;
    }

    if (canSwap && !swapDetails.trim()) {
      setError("Please provide swap details when offering tuition exchange");
      return;
    }

    setLoading(true);
    setError("");

    try {
      console.log("Posting tuition:", formData);

      const token = localStorage.getItem("auth_token");
      if (!token) {
        setError("You are not logged in. Please log in and try again.");
        navigate("/login");
        return;
      }

      // Find the location name from the location_id
      const selectedLocation = mockLocations.find(
        (loc) => loc.id === location_id
      );
      const locationName = selectedLocation
        ? selectedLocation.name
        : location_id;

      // Prepare tuition data for API
      const tuitionData = {
        salary: parseFloat(salary),
        daysWeek: parseInt(days_week), // Backend expects daysWeek, not daysPerWeek
        clazz: cls, // Backend expects clazz, not classLevel
        subject: subject, // Backend expects subject as string, not subjects array
        tStatus: "available", // Backend expects tStatus, not status
        tutorPreference: formData.preferred_tutor,
        contactPhone: phone,
        addressUrl: formData.address_url || null,
        location: locationName, // Send location name as string
        canSwap: canSwap,
        swapDetails: canSwap ? swapDetails : null,
      };

      console.log("Tuition data being sent:", tuitionData);
      console.log("User ID:", user.userId);

      await tuitionAPI.createTuition(tuitionData, user.userId);
      alert("Tuition posted successfully!");
      navigate("/browse/tuitions");
    } catch (error: any) {
      console.error("Error posting tuition:", error);
      setError(error.response?.data?.message || "Failed to post tuition");
    } finally {
      setLoading(false);
    }
  };

  // Group locations by type
  const getAvailableLocations = () => {
    if (selectedLocationType === "on-campus") {
      return mockLocations.filter((loc) => loc.type === "on-campus");
    }
    if (selectedLocationType === "off-campus") {
      return mockLocations.filter((loc) => loc.type === "off-campus");
    }
    return mockLocations;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-8">
        <h1 className="text-2xl font-bold mb-6">Post Tuition Offer</h1>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <InputField
            label="Title *"
            value={formData.title}
            field="title"
            onChange={handleInputChange}
            placeholder="e.g., Math Tutor Available for High School Students"
          />

          <div>
            <label className="block font-medium mb-2">Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="w-full border px-4 py-3 rounded-lg h-32"
              placeholder="Describe your tutoring experience, qualifications, teaching style, and any specific requirements..."
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Class/Level *"
              value={formData.class}
              field="class"
              onChange={handleInputChange}
              placeholder="e.g., Grade 10, University Level, O Level"
            />
            <InputField
              label="Subject(s) *"
              value={formData.subject}
              field="subject"
              onChange={handleInputChange}
              placeholder="e.g., Mathematics, Physics, Chemistry"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Department (Optional)"
              value={formData.department}
              field="department"
              onChange={handleInputChange}
              placeholder="Your academic department"
            />
            <InputField
              label="Salary (BDT/hour) *"
              value={formData.salary}
              field="salary"
              onChange={handleInputChange}
              placeholder="e.g., 500"
              type="number"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Days per Week *"
              value={formData.days_week}
              field="days_week"
              onChange={handleInputChange}
              placeholder="e.g., 3"
              type="number"
            />
            <InputField
              label="Phone Number *"
              value={formData.phone}
              field="phone"
              onChange={handleInputChange}
              placeholder="Your contact number"
              type="tel"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-2">Location Type</label>
              <select
                value={selectedLocationType}
                onChange={(e) => {
                  setSelectedLocationType(e.target.value);
                  setFormData((prev) => ({ ...prev, location_id: "" }));
                }}
                className="w-full border px-4 py-3 rounded-lg"
              >
                <option value="">All Locations</option>
                <option value="on-campus">On Campus</option>
                <option value="off-campus">Off Campus</option>
              </select>
            </div>
            <div>
              <label className="block font-medium mb-2">Location *</label>
              <select
                value={formData.location_id}
                onChange={(e) =>
                  handleInputChange("location_id", e.target.value)
                }
                className="w-full border px-4 py-3 rounded-lg"
                required
              >
                <option value="">Select location</option>
                {getAvailableLocations().map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block font-medium mb-2">Preferred Tutor *</label>
            <select
              value={formData.preferred_tutor}
              onChange={(e) =>
                handleInputChange("preferred_tutor", e.target.value)
              }
              className="w-full border px-4 py-3 rounded-lg"
              required
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="both">Both</option>
            </select>
          </div>

          {/* Swap Option Section */}
          <div className="border-t pt-6">
            <div className="flex items-center space-x-3 mb-4">
              <input
                type="checkbox"
                id="canSwap"
                checked={formData.canSwap}
                onChange={(e) => handleInputChange("canSwap", e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="canSwap" className="font-medium text-gray-700">
                I'm open to tuition exchange/swap
              </label>
            </div>

            {formData.canSwap && (
              <div>
                <label className="block font-medium mb-2">
                  Tuition Exchange Details *
                </label>
                <textarea
                  value={formData.swapDetails}
                  onChange={(e) =>
                    handleInputChange("swapDetails", e.target.value)
                  }
                  className="w-full border px-4 py-3 rounded-lg h-32"
                  placeholder="Describe what kind of tuition you're looking for in exchange:&#10;• What subjects do you need help with?&#10;• What level/grade?&#10;• Preferred location for exchange sessions?&#10;• What subjects can you teach in return?&#10;• Any specific requirements or preferences?"
                  required={formData.canSwap}
                />
                <p className="text-sm text-gray-600 mt-2">
                  Provide complete details about the tuition exchange you're
                  seeking. This helps potential tutors understand if a mutual
                  exchange is possible.
                </p>
              </div>
            )}
          </div>

          <div>
            <label className="block font-medium mb-2">
              Address/Meeting Point (Optional)
            </label>
            <div className="flex gap-2">
              <input
                ref={addressInputRef}
                type="text"
                placeholder="Enter address or Google Maps link"
                className="flex-1 border px-4 py-3 rounded-lg"
              />
              <button
                type="button"
                onClick={handleAddressSet}
                className="bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700"
              >
                Set
              </button>
            </div>
            {formData.address_url && (
              <p className="text-sm text-green-600 mt-2">
                ✓ Address set: {formData.address_url}
              </p>
            )}
          </div>

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
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Posting..." : "Post Tuition"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function InputField({
  label,
  value,
  field,
  onChange,
  placeholder = "",
  type = "text",
}: {
  label: string;
  value: string;
  field: string;
  onChange: (field: string, val: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="block font-medium mb-2">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(field, e.target.value)}
        className="w-full border px-4 py-3 rounded-lg"
        placeholder={placeholder}
        required
      />
    </div>
  );
}
