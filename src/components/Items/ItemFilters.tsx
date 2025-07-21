import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Category, Condition } from '../../types';

interface ItemFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedCondition: string;
  onConditionChange: (condition: string) => void;
  selectedType: string;
  onTypeChange: (type: string) => void;
  selectedLocation: string;
  onLocationChange: (location: string) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

const categories: Category[] = ['Textbooks', 'Electronics', 'Clothing', 'Furniture', 'Stationery', 'Sports', 'Kitchen', 'Other'];
const conditions: Condition[] = ['New', 'Like New', 'Good', 'Fair', 'Poor'];
const types = ['free', 'swap', 'rent'];
const locations = [
  'North Hall', 'South Hall', 'East Hall', 'West Hall',
  'Library', 'Student Center', 'Engineering Building',
  'Science Building', 'Arts Building', 'Sports Complex'
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
  selectedLocation,
  onLocationChange,
  onClearFilters,
  hasActiveFilters
}: ItemFiltersProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm mb-8 space-y-6">
      {/* Search Bar */}
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

      {/* Filter Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        {/* Condition Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Condition
          </label>
          <select
            value={selectedCondition}
            onChange={(e) => onConditionChange(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Any Condition</option>
            {conditions.map(condition => (
              <option key={condition} value={condition}>{condition}</option>
            ))}
          </select>
        </div>

        {/* Type Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type
          </label>
          <select
            value={selectedType}
            onChange={(e) => onTypeChange(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Types</option>
            {types.map(type => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Location Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <select
            value={selectedLocation}
            onChange={(e) => onLocationChange(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Locations</option>
            {locations.map(location => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>
        </div>

        {/* Clear Filters */}
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