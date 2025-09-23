import { Search, X } from "lucide-react";
import { mockSubjects, mockClassLevels } from "../../lib/mockData";

interface TuitionFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedSubject: string;
  onSubjectChange: (subject: string) => void;
  selectedClassLevel: string;
  onClassLevelChange: (level: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

const statuses = ["available", "taken", "completed"];

export function TuitionFilters({
  searchTerm,
  onSearchChange,
  selectedSubject,
  onSubjectChange,
  selectedClassLevel,
  onClassLevelChange,
  selectedStatus,
  onStatusChange,
  onClearFilters,
  hasActiveFilters,
}: TuitionFiltersProps) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm mb-8 space-y-6">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search tuitions by title, description, or tutor..."
          className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-bright-cyan focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
        />
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Subject */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Subject
          </label>
          <select
            value={selectedSubject}
            onChange={(e) => onSubjectChange(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-bright-cyan bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="">All Subjects</option>
            {mockSubjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
        </div>

        {/* Class Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Class Level
          </label>
          <select
            value={selectedClassLevel}
            onChange={(e) => onClassLevelChange(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-bright-cyan bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="">All Levels</option>
            {mockClassLevels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Status
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-bright-cyan bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="">All Status</option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Clear */}
        <div className="flex items-end md:col-span-2 lg:col-span-2">
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="w-full bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-500 px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors"
            >
              <X className="h-4 w-4" />
              <span>Clear Filters</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
