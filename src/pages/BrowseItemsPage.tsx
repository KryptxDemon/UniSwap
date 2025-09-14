import React, { useState, useEffect } from "react";
import { ItemCard } from "../components/Items/ItemCard";
import { ItemFilters } from "../components/Items/ItemFilters";
import { Package } from "lucide-react";
import { itemAPI } from "../services/apiService";

export function BrowseItemsPage() {
  const [allItems, setAllItems] = useState<any[]>([]);
  const [filteredItems, setFilteredItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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

  // Fetch all items from API
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        const items = await itemAPI.getAllItems();
        setAllItems(items);
      } catch (err) {
        setError("Failed to load items");
        console.error("Error fetching items:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  // Filter items based on search criteria
  useEffect(() => {
    let filtered = [...allItems];

    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.itemName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.post?.user?.username
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(
        (item) => item.category?.categoryId?.toString() === selectedCategory
      );
    }

    if (selectedCondition) {
      filtered = filtered.filter(
        (item) => item.itemCondition === selectedCondition
      );
    }

    if (selectedType) {
      filtered = filtered.filter((item) => item.itemType === selectedType);
    }

    if (locationType) {
      filtered = filtered.filter(
        (item) => item.location?.locationType === locationType
      );
    }

    if (selectedLocation) {
      filtered = filtered.filter(
        (item) => item.location?.locationId?.toString() === selectedLocation
      );
    }

    setFilteredItems(filtered);
  }, [
    allItems,
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

  if (loading) {
    return (
      <div className="min-h-screen bg-powder-blue/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading items...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-powder-blue/30 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-powder-blue/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Filter Bar */}
        <div className="pt-6 pb-6">
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

        <div className="mb-4 flex items-center justify-between px-2">
          <p className="text-gray-600 text-sm">
            Showing {filteredItems.length}{" "}
            {filteredItems.length === 1 ? "item" : "items"}
          </p>
        </div>

        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 pb-6">
            {filteredItems.map((item) => (
              <ItemCard key={item.itemId || item.id} item={item} />
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
