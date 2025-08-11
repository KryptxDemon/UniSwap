import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, MapPin, DollarSign, User, BookOpen, Calendar } from 'lucide-react';
import { Tuition } from '../../types';

interface TuitionCardProps {
  tuition: Tuition;
}

export function TuitionCard({ tuition }: TuitionCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'taken': return 'bg-orange-100 text-orange-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
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
      to={`/tuition/${tuition.id}`}
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group"
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {tuition.title}
          </h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ml-2 whitespace-nowrap ${getStatusColor(tuition.status)}`}>
            {tuition.status.charAt(0).toUpperCase() + tuition.status.slice(1)}
          </span>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {tuition.description}
        </p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <DollarSign className="h-4 w-4" />
            <span>৳{tuition.salary}/month</span>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>{tuition.days_per_week} days/week</span>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <BookOpen className="h-4 w-4" />
            <span>{tuition.class_level}</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-1 mb-4">
          {tuition.subjects.slice(0, 3).map((subject, index) => (
            <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs">
              {subject}
            </span>
          ))}
          {tuition.subjects.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs">
              +{tuition.subjects.length - 3} more
            </span>
          )}
        </div>
        
        <div className="space-y-2 text-sm text-gray-500">
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4" />
            <span>{tuition.location}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>{tuition.tutor?.username || 'Anonymous'}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>{formatDate(tuition.created_at)}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}