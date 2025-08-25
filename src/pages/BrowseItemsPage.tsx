import React, { useState, useEffect } from "react";
import { ItemCard } from "../components/Items/ItemCard";
import { ItemFilters } from "../components/Items/ItemFilters";
import { demoItems } from "../lib/demoData";
import { Package } from "lucide-react";

export function BrowseItemsPage() {
  const [filteredItems, setFilteredItems] = useState(demoItems);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCondition, setSelectedCondition] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [locationType, setLocationType] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

  const hasActiveFilters =
    !!searchTerm ||
    !!selectedCategory ||
    !!selectedCondition ||
    !!selectedType ||
    !!locationType ||
    !!selectedLocation;

  useEffect(() => {
    let filtered = demoItems;

    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.user?.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter((item) => item.category.id === selectedCategory);
    }

    if (selectedCondition) {
      filtered = filtered.filter(
        (item) => item.condition === selectedCondition
      );
    }

    if (selectedType) {
      filtered = filtered.filter((item) => item.type === selectedType);
    }

    if (locationType) {
      filtered = filtered.filter((item) => item.location.type === locationType);
    }

    if (selectedLocation) {
      filtered = filtered.filter((item) => item.location.id === selectedLocation);
    }

    setFilteredItems(filtered);
  }, [
    searchTerm,
    selectedCategory,
    selectedCondition,
    selectedType,
    locationType,
    selectedLocation,
  ]);

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedCondition("");
    setSelectedType("");
    setLocationType("");
    setSelectedLocation("");
  };

  return (
    <div className="min-h-screen bg-sky-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Sticky Filter Bar */}
        <div className="sticky top-16 z-20 bg-sky-100 pt-6 pb-2">
          <div className="bg-white rounded-xl shadow-sm px-4 py-3 border border-gray-200">
            <ItemFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              selectedCondition={selectedCondition}
              onConditionChange={setSelectedCondition}
              selectedType={selectedType}
              onTypeChange={setSelectedType}
              locationType={locationType}
              onLocationTypeChange={setLocationType}
              selectedLocation={selectedLocation}
              onLocationChange={setSelectedLocation}
              onClearFilters={handleClearFilters}
              hasActiveFilters={hasActiveFilters}
            />
          </div>
        </div>

        <div className="mb-4 flex items-center justify-between px-2">
          <p className="text-gray-600 text-sm">
            Showing {filteredItems.length}{" "}
            {filteredItems.length === 1 ? "item" : "items"}
          </p>
        </div>

        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 pb-6">
            {filteredItems.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 pb-6">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-base font-medium text-gray-800">
              No items found
            </h3>
            <p className="text-gray-600 text-sm">
              {hasActiveFilters
                ? "Try adjusting your filters"
                : "No items have been posted yet"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
