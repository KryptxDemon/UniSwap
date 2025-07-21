import React, { useState, useEffect } from 'react';
import { ItemCard } from '../components/Items/ItemCard';
import { ItemFilters } from '../components/Items/ItemFilters';
import { Item } from '../types';
import { Package } from 'lucide-react';

// Sample data - in a real app, this would come from Supabase
const sampleItems: Item[] = [
  {
    id: '1',
    title: 'Physics for Engineers - Giassudin',
    description: 'Complete textbook for Physics 101. Used for one semester, excellent condition with minimal highlighting. All chapters included.',
    category: 'Textbooks',
    condition: 'Like New',
    type: 'swap',
    location: 'North Hall',
    department: 'Engineering',
    images: ['https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=500'],
    user_id: '1',
    user: { id: '1', username: 'sarah_eng', email: 'sarah@uni.edu', created_at: '2025-01-01' },
    created_at: '2025-01-15T10:30:00Z',
    is_exchanged: false
  },
  {
    id: '2',
    title: 'Used T Scale for donation',
    description: 'Engineering T-scale ruler in good condition. Free for any engineering student who needs it.',
    category: 'Stationery',
    condition: 'Good',
    type: 'free',
    location: 'Engineering Building',
    images: ['https://images.pexels.com/photos/8088501/pexels-photo-8088501.jpeg?auto=compress&cs=tinysrgb&w=500'],
    user_id: '2',
    user: { id: '2', username: 'mike_arch', email: 'mike@uni.edu', created_at: '2025-01-01' },
    created_at: '2025-01-16T14:20:00Z',
    is_exchanged: false
  },
  {
    id: '3',
    title: 'Foldable table for exchange',
    description: 'Compact foldable study table, perfect for dorm rooms. Looking to exchange for a desk lamp or small bookshelf.',
    category: 'Furniture',
    condition: 'Good',
    type: 'swap',
    location: 'South Hall',
    images: ['https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=500'],
    user_id: '3',
    user: { id: '3', username: 'alex_design', email: 'alex@uni.edu', created_at: '2025-01-01' },
    created_at: '2025-01-17T09:15:00Z',
    is_exchanged: false
  },
  {
    id: '4',
    title: 'Tuition in Halishahar exchange',
    description: 'Offering math and physics tutoring sessions. Looking for exchange with computer science or programming help.',
    category: 'Other',
    condition: 'New',
    type: 'swap',
    location: 'Library',
    images: ['https://images.pexels.com/photos/5905709/pexels-photo-5905709.jpeg?auto=compress&cs=tinysrgb&w=500'],
    user_id: '4',
    user: { id: '4', username: 'tutor_sam', email: 'sam@uni.edu', created_at: '2025-01-01' },
    created_at: '2025-01-18T16:45:00Z',
    is_exchanged: false
  },
  {
    id: '5',
    title: 'MacBook Pro 13" for rent',
    description: 'MacBook Pro 13" available for short-term rental. Perfect for projects or presentations. $20/week.',
    category: 'Electronics',
    condition: 'Like New',
    type: 'rent',
    location: 'Student Center',
    images: ['https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=500'],
    user_id: '5',
    user: { id: '5', username: 'tech_rental', email: 'tech@uni.edu', created_at: '2025-01-01' },
    created_at: '2025-01-19T11:30:00Z',
    is_exchanged: false
  },
  {
    id: '6',
    title: 'Organic Chemistry Textbook',
    description: 'Essential textbook for Organic Chemistry course. Has some highlighting but all pages are intact. Great for study.',
    category: 'Textbooks',
    condition: 'Good',
    type: 'free',
    location: 'Science Building',
    department: 'Chemistry',
    images: ['https://images.pexels.com/photos/256455/pexels-photo-256455.jpeg?auto=compress&cs=tinysrgb&w=500'],
    user_id: '6',
    user: { id: '6', username: 'chem_student', email: 'chem@uni.edu', created_at: '2025-01-01' },
    created_at: '2025-01-20T08:20:00Z',
    is_exchanged: false
  }
];

export function BrowseItemsPage() {
  const [items, setItems] = useState<Item[]>(sampleItems);
  const [filteredItems, setFilteredItems] = useState<Item[]>(sampleItems);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCondition, setSelectedCondition] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');

  const hasActiveFilters = searchTerm || selectedCategory || selectedCondition || selectedType || selectedLocation;

  useEffect(() => {
    let filtered = items;

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.user?.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    if (selectedCondition) {
      filtered = filtered.filter(item => item.condition === selectedCondition);
    }

    if (selectedType) {
      filtered = filtered.filter(item => item.type === selectedType);
    }

    if (selectedLocation) {
      filtered = filtered.filter(item => item.location === selectedLocation);
    }

    setFilteredItems(filtered);
  }, [items, searchTerm, selectedCategory, selectedCondition, selectedType, selectedLocation]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedCondition('');
    setSelectedType('');
    setSelectedLocation('');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Items</h1>
          <p className="text-gray-600">Discover items shared by your fellow students</p>
        </div>

        <ItemFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          selectedCondition={selectedCondition}
          onConditionChange={setSelectedCondition}
          selectedType={selectedType}
          onTypeChange={setSelectedType}
          selectedLocation={selectedLocation}
          onLocationChange={setSelectedLocation}
          onClearFilters={handleClearFilters}
          hasActiveFilters={hasActiveFilters}
        />

        <div className="mb-6 flex items-center justify-between">
          <p className="text-gray-600">
            Showing {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'}
          </p>
        </div>

        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No items found</h3>
            <p className="text-gray-600">
              {hasActiveFilters ? 'Try adjusting your filters' : 'No items have been posted yet'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}