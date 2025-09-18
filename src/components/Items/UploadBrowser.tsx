import React, { useState, useEffect } from "react";
import { uploadAPI } from "../../services/uploadService";
import { Image, Loader, AlertCircle } from "lucide-react";

export function UploadBrowser() {
  const [files, setFiles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        setLoading(true);
        const fileList = await uploadAPI.listFiles();
        setFiles(fileList);
      } catch (err) {
        setError("Failed to load uploaded files");
        console.error("Error fetching files:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Image className="h-6 w-6" />
          Uploaded Images
        </h2>
        <div className="flex items-center justify-center py-8">
          <Loader className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Loading images...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Image className="h-6 w-6" />
          Uploaded Images
        </h2>
        <div className="flex items-center justify-center py-8 text-red-600">
          <AlertCircle className="h-8 w-8" />
          <span className="ml-2">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <Image className="h-6 w-6" />
        Uploaded Images ({files.length})
      </h2>

      {files.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Image className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <p>No images uploaded yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {files.map((filename, index) => (
            <div
              key={index}
              className="relative group rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition-shadow"
            >
              <img
                src={`${
                  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"
                }/api/uploads/${filename}`}
                alt={`Upload ${index + 1}`}
                className="w-full h-32 object-cover"
                onError={(e) => {
                  e.currentTarget.src =
                    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y1ZjVmNSIvPgogIDx0ZXh0IHg9IjEwMCIgeT0iMTAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTk5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBub3QgZm91bmQ8L3RleHQ+Cjwvc3ZnPg==";
                }}
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200" />
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-2 text-xs truncate opacity-0 group-hover:opacity-100 transition-opacity">
                {filename}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
