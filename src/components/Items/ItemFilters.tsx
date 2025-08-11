import React from "react";
import { Search, X } from "lucide-react";
import { Category, Condition } from "../../types";

interface ItemFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedCondition: string;
  onConditionChange: (condition: string) => void;
  selectedType: string;
  onTypeChange: (type: string) => void;
  locationType: string;
  onLocationTypeChange: (type: string) => void;
  selectedLocation: string;
  onLocationChange: (location: string) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

const categories: Category[] = [
  "Textbooks",
  "Electronics",
  "Clothing",
  "Furniture",
  "Stationery",
  "Sports",
  "Kitchen",
  "Other",
];
const conditions: Condition[] = ["New", "Like New", "Good", "Fair", "Poor"];
const types = ["free", "swap", "rent"];

const campusLocations = [
  "Tarek Huda Hall",
  "Shah Hall",
  "Abu Sayeed Hall",
  "Kazi Nazrul Islam Hall",
  "Library",
  "TSC",
  "CE Building",
  "ME Building",
  "EEE Building",
  "Muktijoddha Hall",
  "Sufia Kamal Hall",
  "Taposhi Rabeya Hall",
  "Shamsun Nahar Hall",
  "CSE Building",
  "Architecture Building",
  "PME Building",
  "Incubator",
  "Dr. Qudrat-E-Khuda Hall",
  "Teachers Dorm",
  "West Gate",
];

const chittagongAreas = [
  "Agrabad",
  "Pahartali",
  "Chawkbazar",
  "Nasirabad",
  "Khulshi",
  "GEC",
  "Oxygen",
  "Muradpur",
  "Kotwali",
  "Anderkilla",
  "Jubilee Road",
  "Bayezid",
  "Halishahar",
  "EPZ",
  "Patenga",
];

export function ItemFilters({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedCondition,
  onConditionChange,
  selectedType,
  onTypeChange,
  locationType,
  onLocationTypeChange,
  selectedLocation,
  onLocationChange,
  onClearFilters,
  hasActiveFilters,
}: ItemFiltersProps) {
  const locationOptions =
    locationType === "on-campus" ? campusLocations : chittagongAreas;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm mb-8 space-y-6">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search items by title, description, or username..."
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Condition */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Condition
          </label>
          <select
            value={selectedCondition}
            onChange={(e) => onConditionChange(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Any Condition</option>
            {conditions.map((cond) => (
              <option key={cond} value={cond}>
                {cond}
              </option>
            ))}
          </select>
        </div>

        {/* Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type
          </label>
          <select
            value={selectedType}
            onChange={(e) => onTypeChange(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Types</option>
            {types.map((t) => (
              <option key={t} value={t}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Location Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location Type
          </label>
          <select
            value={locationType}
            onChange={(e) => onLocationTypeChange(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Type</option>
            <option value="on-campus">On Campus</option>
            <option value="off-campus">Off Campus</option>
          </select>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <select
            value={selectedLocation}
            onChange={(e) => onLocationChange(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            disabled={!locationType}
          >
            <option value="">All Locations</option>
            {locationOptions.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        {/* Clear */}
        <div className="flex items-end">
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="w-full bg-gray-100 text-gray-700 hover:bg-gray-200 px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors"
            >
              <X className="h-4 w-4" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
