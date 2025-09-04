import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { demoItems } from "../lib/demoData";
import { mockLocations } from "../lib/mockData";

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
    post_time: new Date().toISOString(),
  });

  const handleInputChange = (field: string, value: string) => {
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
    } = formData;

    if (
      !title ||
      !description ||
      !location_id ||
      !salary ||
      !days_week ||
      !cls ||
      !subject
    ) {
      setError("Please fill in all required fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      console.log("Posting tuition:", formData);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newItem = {
        id: `tuition-${Date.now()}`,
        title,
        description,
        category: { id: "tuition", name: "Tuition" },
        condition: "New",
        type: "rent" as const,
        location: mockLocations.find((l) => l.id === location_id)!,
        department: formData.department,
        salary: parseInt(formData.salary),
        days_per_week: parseInt(formData.days_week),
        class_level: formData.class,
        subjects: [formData.subject],
        status: "available" as const,
        created_at: formData.post_time,
        user_id: user.id,
        user,
        address_url: formData.address_url,
        preferred_tutor: formData.preferred_tutor,
        is_exchanged: false,
      };

      const stored = localStorage.getItem("tuitions");
      const arr = stored ? JSON.parse(stored) : [];
      arr.push(newItem);
      localStorage.setItem("tuitions", JSON.stringify(arr));

      const goEdit = window.confirm(
        "Item has been listed. Press OK to edit or Cancel to continue."
      );
      if (goEdit) {
        navigate(`/tuition/${newItem.id}`);
      } else {
        navigate("/browse/tuitions");
      }
    } catch (err: any) {
      setError(err.message || "Failed to post tuition offer");
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
            You need to be signed in to post a tuition offer.
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

  const locationOptions = selectedLocationType
    ? mockLocations.filter((location) => location.type === selectedLocationType)
    : [];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Post a Tuition Offer</h1>
          <p className="text-gray-600">
            Share your tuition offer or exchange opportunity
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

          {/* Location */}
          <div>
            <label className="block font-medium mb-2">Location Type *</label>
            <select
              value={selectedLocationType}
              onChange={(e) => {
                setSelectedLocationType(e.target.value);
                handleInputChange("location_id", "");
              }}
              className="w-full border px-4 py-3 rounded-lg mb-4"
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
              className="w-full border px-4 py-3 rounded-lg"
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-medium mb-2">
                Department (optional)
              </label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) =>
                  handleInputChange("department", e.target.value)
                }
                className="w-full border px-4 py-3 rounded-lg"
              />
            </div>

            <InputField
              label="Salary (per month) *"
              value={formData.salary}
              field="salary"
              onChange={handleInputChange}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Days per Week *"
              value={formData.days_week}
              field="days_week"
              onChange={handleInputChange}
            />
            <InputField
              label="Class *"
              value={formData.class}
              field="class"
              onChange={handleInputChange}
            />
          </div>

          <InputField
            label="Subject *"
            value={formData.subject}
            field="subject"
            onChange={handleInputChange}
          />

          {/* Address URL and Preferred Tutor */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-medium mb-2">Address URL *</label>
              <div className="flex gap-2">
                <input
                  type="url"
                  ref={addressInputRef}
                  defaultValue={formData.address_url}
                  placeholder="Paste Google Maps or address URL"
                  className="flex-1 border px-4 py-3 rounded-lg"
                  required
                />
                <button
                  type="button"
                  onClick={handleAddressSet}
                  className="bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700"
                >
                  Set
                </button>
              </div>
            </div>
            <div>
              <label className="block font-medium mb-2">
                Preferred Tutor *
              </label>
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
}: {
  label: string;
  value: string;
  field: string;
  onChange: (field: string, val: string) => void;
}) {
  return (
    <div>
      <label className="block font-medium mb-2">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(field, e.target.value)}
        className="w-full border px-4 py-3 rounded-lg"
        required
      />
    </div>
  );
}
