import React, { useState, useEffect } from "react";
import { TuitionCard } from "../components/Tuition/TuitionCard";
import { TuitionFilters } from "../components/Tuition/TuitionFilters";
import { demoTuitions } from "../lib/demoData";
import { BookOpen } from "lucide-react";

export function BrowseTuitionsPage() {
  const [filteredTuitions, setFilteredTuitions] = useState(demoTuitions);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedClassLevel, setSelectedClassLevel] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const hasActiveFilters =
    !!searchTerm ||
    !!selectedSubject ||
    !!selectedClassLevel ||
    !!selectedStatus;

  useEffect(() => {
    let filtered = demoTuitions;

    if (searchTerm) {
      filtered = filtered.filter(
        (tuition) =>
          tuition.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tuition.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tuition.tutor?.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedSubject) {
      filtered = filtered.filter((tuition) =>
        tuition.subjects.some(subject => 
          subject.toLowerCase().includes(selectedSubject.toLowerCase())
        )
      );
    }

    if (selectedClassLevel) {
      filtered = filtered.filter((tuition) => tuition.class_level === selectedClassLevel);
    }

    if (selectedStatus) {
      filtered = filtered.filter((tuition) => tuition.status === selectedStatus);
    }

    setFilteredTuitions(filtered);
  }, [
    searchTerm,
    selectedSubject,
    selectedClassLevel,
    selectedStatus,
  ]);

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedSubject("");
    setSelectedClassLevel("");
    setSelectedStatus("");
  };

  return (
    <div className="min-h-screen bg-green-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Tuitions</h1>
          <p className="text-gray-600">Find tutoring opportunities from fellow students</p>
        </div>

        {/* Sticky Filter Bar */}
        <div className="sticky top-0 z-20 bg-green-50 pt-6 pb-2">
          <div className="bg-white rounded-xl shadow-sm px-4 py-3 border border-gray-200">
            <TuitionFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedSubject={selectedSubject}
              onSubjectChange={setSelectedSubject}
              selectedClassLevel={selectedClassLevel}
              onClassLevelChange={setSelectedClassLevel}
              selectedStatus={selectedStatus}
              onStatusChange={setSelectedStatus}
              onClearFilters={handleClearFilters}
              hasActiveFilters={hasActiveFilters}
            />
          </div>
        </div>

        <div className="mb-4 flex items-center justify-between">
          <p className="text-gray-600 text-sm">
            Showing {filteredTuitions.length}{" "}
            {filteredTuitions.length === 1 ? "tuition" : "tuitions"}
          </p>
        </div>

        {filteredTuitions.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredTuitions.map((tuition) => (
              <TuitionCard key={tuition.id} tuition={tuition} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-base font-medium text-gray-800">
              No tuitions found
            </h3>
            <p className="text-gray-600 text-sm">
              {hasActiveFilters
                ? "Try adjusting your filters"
                : "No tuitions have been posted yet"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}