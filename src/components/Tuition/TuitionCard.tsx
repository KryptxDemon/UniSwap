import { Link } from "react-router-dom";
import {
  Clock,
  MapPin,
  DollarSign,
  User,
  BookOpen,
  Calendar,
} from "lucide-react";
import { Tuition } from "../../types";

interface TuitionCardProps {
  tuition: Tuition;
}

export function TuitionCard({ tuition }: TuitionCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-powder-blue text-pine-green";
      case "taken":
        return "bg-burnt-sienna/20 text-burnt-sienna";
      case "completed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInHours < 168) {
      // 7 days
      return `${Math.floor(diffInHours / 24)}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <Link
      to={`/tuition/${tuition.tuitionId}`}
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group"
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {tuition.subject} - {tuition.clazz}
          </h3>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ml-2 whitespace-nowrap ${getStatusColor(
              tuition.tStatus
            )}`}
          >
            {tuition.tStatus.charAt(0).toUpperCase() + tuition.tStatus.slice(1)}
          </span>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          Tuition for {tuition.subject} - {tuition.clazz}
        </p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <DollarSign className="h-4 w-4" />
            <span>৳{tuition.salary}/month</span>
          </div>

          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>{tuition.daysWeek} days/week</span>
          </div>

          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <BookOpen className="h-4 w-4" />
            <span>{tuition.clazz}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mb-4">
          <span className="px-2 py-1 bg-bright-cyan/20 text-pine-green rounded-md text-xs">
            {tuition.subject}
          </span>
        </div>

        <div className="space-y-2 text-sm text-gray-500">
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4" />
            <span>{tuition.location?.name || "Location not specified"}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>{tuition.post?.user?.username || "Anonymous"}</span>
            </div>

            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>
                {formatDate(tuition.post?.postTime || new Date().toISOString())}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
