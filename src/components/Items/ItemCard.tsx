import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, MapPin, Tag, User } from 'lucide-react';
import { Item } from '../../types';

interface ItemCardProps {
  item: Item;
}

export function ItemCard({ item }: ItemCardProps) {
  const getTypeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'free': return 'bg-powder-blue text-pine-green';
      case 'swap': return 'bg-bright-cyan/20 text-dark-teal';
      case 'rent': return 'bg-burnt-sienna/20 text-burnt-sienna';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'NEW': case 'New': return 'bg-powder-blue text-pine-green';
      case 'LIKE_NEW': case 'Like New': return 'bg-bright-cyan/20 text-dark-teal';
      case 'GOOD': case 'Good': return 'bg-powder-blue/50 text-pine-green';
      case 'FAIR': case 'Fair': return 'bg-burnt-sienna/20 text-burnt-sienna';
      case 'POOR': case 'Poor': return 'bg-burnt-sienna/30 text-burnt-sienna';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInHours < 168) { // 7 days
      return `${Math.floor(diffInHours / 24)}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <Link
      to={`/item/${item.itemId || item.id}`}
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group"
    >
      <div className="aspect-w-16 aspect-h-12 bg-gray-200 overflow-hidden">
        {item.images && item.images.length > 0 ? (
          <img
            src={item.images[0]}
            alt={item.itemName || item.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <Tag className="h-12 w-12 text-gray-400" />
          </div>
        )}
      </div>
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {item.itemName || item.title}
          </h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ml-2 whitespace-nowrap ${getTypeColor(item.itemType || item.type || 'unknown')}`}>
            {(item.itemType || item.type || 'unknown').charAt(0).toUpperCase() + (item.itemType || item.type || 'unknown').slice(1)}
          </span>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {item.description}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs">
            {item.category?.categoryName || item.category?.name || 'Uncategorized'}
          </span>
          <span className={`px-2 py-1 rounded-md text-xs font-medium ${getConditionColor(item.itemCondition || item.condition || 'Unknown')}`}>
            {item.itemCondition || item.condition || 'Unknown'}
          </span>
        </div>
        
        <div className="space-y-2 text-sm text-gray-500">
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4" />
            <span>{item.location?.locationName || item.location?.name || 'Unknown location'}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>{item.post?.user?.username || item.user?.username || 'Anonymous'}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>{formatDate(item.post?.postTime || item.created_at || new Date().toISOString())}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}