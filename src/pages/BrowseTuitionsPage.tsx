import { useState, useEffect } from "react";
import { TuitionCard } from "../components/Tuition/TuitionCard";
import { TuitionFilters } from "../components/Tuition/TuitionFilters";
import { BookOpen } from "lucide-react";
import { tuitionAPI } from "../services/apiService";

export function BrowseTuitionsPage() {
  const [allTuitions, setAllTuitions] = useState<any[]>([]);
  const [filteredTuitions, setFilteredTuitions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedClassLevel, setSelectedClassLevel] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const hasActiveFilters =
    !!searchTerm ||
    !!selectedSubject ||
    !!selectedClassLevel ||
    !!selectedStatus;

  // Fetch all tuitions from API
  useEffect(() => {
    const fetchTuitions = async () => {
      try {
        setLoading(true);
        const tuitions = await tuitionAPI.getAllTuitions();
        setAllTuitions(tuitions);
      } catch (err) {
        setError("Failed to load tuitions");
        console.error("Error fetching tuitions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTuitions();
  }, []);

  // Filter tuitions based on search criteria
  useEffect(() => {
    let filtered = [...allTuitions];

    if (searchTerm) {
      filtered = filtered.filter(
        (tuition) =>
          tuition.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tuition.post?.user?.username
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    if (selectedSubject) {
      filtered = filtered.filter((tuition) =>
        tuition.subject?.toLowerCase().includes(selectedSubject.toLowerCase())
      );
    }

    if (selectedClassLevel) {
      filtered = filtered.filter(
        (tuition) => tuition.clazz === selectedClassLevel
      );
    }

    if (selectedStatus) {
      filtered = filtered.filter(
        (tuition) => tuition.tStatus === selectedStatus
      );
    }

    setFilteredTuitions(filtered);
  }, [
    allTuitions,
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

  if (loading) {
    return (
      <div className="min-h-screen bg-bright-cyan/10 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tuitions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-bright-cyan/10 flex items-center justify-center">
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
    <div className="min-h-screen bg-bright-cyan/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 pt-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Browse Tuitions
          </h1>
          <p className="text-gray-600">
            Find tutoring opportunities from fellow students
          </p>
        </div>

        {/* Filter Bar */}
        <div className="mb-6">
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

        <div className="mb-4 flex items-center justify-between px-2">
          <p className="text-gray-600 text-sm">
            Showing {filteredTuitions.length}{" "}
            {filteredTuitions.length === 1 ? "tuition" : "tuitions"}
          </p>
        </div>

        {filteredTuitions.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-6">
            {filteredTuitions.map((tuition) => (
              <TuitionCard key={tuition.tuitionId} tuition={tuition} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 pb-6">
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
