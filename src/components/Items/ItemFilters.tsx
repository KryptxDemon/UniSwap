import React from "react";
import { Search, X } from "lucide-react";
import { Category, Location, Condition } from "../../types";
import { mockCategories, mockLocations } from "../../lib/mockData";

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

const conditions: Condition[] = ["New", "Like New", "Good", "Fair", "Poor"];
const types = ["free", "swap", "rent"];


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
  const locationOptions = mockLocations.filter(location => {
    if (locationType === "on-campus") return location.type === "on-campus";
    if (locationType === "off-campus") return location.type === "off-campus";
    return true;
  });

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
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pine-green focus:border-transparent"
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
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pine-green"
          >
            <option value="">All Categories</option>
            {mockCategories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
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
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pine-green"
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
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pine-green"
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
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pine-green"
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
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pine-green"
            disabled={!locationType}
          >
            <option value="">All Locations</option>
            {locationOptions.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.name}
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
