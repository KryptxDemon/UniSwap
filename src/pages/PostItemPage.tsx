import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { X, ImagePlus } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { demoItems } from "../lib/demoData";
import { Category, Condition } from "../types";

const categories: Category[] = [
  "Textbooks", "Electronics", "Clothing", "Furniture", "Stationery", "Sports", "Kitchen", "Other",
];
const conditions: Condition[] = ["New", "Like New", "Good", "Fair", "Poor"];
const types = ["free", "swap", "rent"];
const locations = [
  "Tarek Huda Hall", "Shah Hall", "Abu Sayeed Hall", "Kazi Nazrul Islam Hall",
  "Library", "TSC", "CE Building", "ME Building", "EEE Building", "Muktijoddha Hall",
  "Sufia Kamal Hall", "Taposhi Rabeya Hall", "Shamsun Nahar Hall", "CSE Building",
  "Architecture Building", "PME Building", "Incubator", "Dr. Qudrat-E-Khuda Hall",
  "Teachers Dorm", "West Gate",
];

export function PostItemPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    condition: "",
    type: "",
    location: "",
    department: "",
    images: [] as string[],
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageAdd = () => {
    const input = imageInputRef.current;
    if (input && input.value.trim() && formData.images.length < 5) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, input.value.trim()],
      }));
      input.value = "";
    }
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

    const { title, description, category, condition, type, location } = formData;
    if (!title || !description || !category || !condition || !type || !location) {
      setError("Please fill in all required fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      console.log("Posting item:", formData);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newItem = {
        id: String(demoItems.length + 1),
        ...formData,
        user_id: user.id,
        user,
        created_at: new Date().toISOString(),
        is_exchanged: false,
      };

      demoItems.push(newItem);
      navigate("/browse");
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
          <p className="text-gray-600 mb-6">You need to be signed in to post an item.</p>
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Post an Item</h1>
          <p className="text-gray-600">Share an item with your university community</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow space-y-6">
          {error && <div className="bg-red-100 text-red-700 p-4 rounded-lg">{error}</div>}

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
            <SelectInput label="Category *" value={formData.category} onChange={(val) => handleInputChange("category", val)} options={categories} />
            <SelectInput label="Condition *" value={formData.condition} onChange={(val) => handleInputChange("condition", val)} options={conditions} />
            <SelectInput label="Type *" value={formData.type} onChange={(val) => handleInputChange("type", val)} options={types.map(t => t.charAt(0).toUpperCase() + t.slice(1))} rawOptions={types} />
          </div>

          {/* Location and Department */}
          <div className="grid grid-cols-1 md:grid-cols
