import apiClient from "../lib/apiClient";

// User API calls
export const userAPI = {
  getUserById: async (userId: number) => {
    const response = await apiClient.get(`/api/users/${userId}`);
    const user = response.data;
    // Map backend field names to frontend field names
    return {
      ...user,
      userId: user.userId,
      username: user.displayUsername || user.username,
      profilePicture: user.profilePicture || "",
      studentId: user.studentId || "",
      email: user.email,
      bio: user.bio || "",
    };
  },

  getUserByEmail: async (email: string) => {
    const response = await apiClient.get(`/api/users/email/${email}`);
    const user = response.data;
    // Map backend field names to frontend field names
    return {
      ...user,
      userId: user.userId,
      username: user.displayUsername || user.username,
      profilePicture: user.profilePicture || "",
      studentId: user.studentId || "",
      email: user.email,
      bio: user.bio || "",
    };
  },

  updateUser: async (userId: number, userData: any) => {
    // Map frontend field names to backend field names
    const backendData = {
      ...userData,
      userId: userId,
      username: userData.username,
      profilePicture: userData.profilePicture,
      studentId: userData.studentId,
    };

    const response = await apiClient.put(`/api/users/${userId}`, backendData);
    const user = response.data;
    // Map backend response back to frontend format
    return {
      ...user,
      userId: user.userId,
      username: user.displayUsername || user.username,
      profilePicture: user.profilePicture || "",
      studentId: user.studentId || "",
      email: user.email,
      bio: user.bio || "",
    };
  },

  getAllUsers: async () => {
    const response = await apiClient.get("/api/users");
    return response.data.map((user: any) => ({
      ...user,
      userId: user.userId,
      username: user.displayUsername || user.username,
      profilePicture: user.profilePicture || "",
      studentId: user.studentId || "",
      email: user.email,
      bio: user.bio || "",
    }));
  },

  deleteUser: async (userId: number) => {
    await apiClient.delete(`/api/users/${userId}`);
  },
};

// Import mockLocations for location mapping
import { mockLocations } from "../lib/mockData";

// Map backend location (could be ID or object) to frontend location format
const mapLocationFromBackend = (backendLocation: any) => {
  // If already a proper object with name, return as-is
  if (
    backendLocation &&
    typeof backendLocation === "object" &&
    backendLocation.name
  ) {
    return backendLocation;
  }

  // If it's a string that's not numeric, treat as location name
  if (typeof backendLocation === "string" && isNaN(Number(backendLocation))) {
    return {
      id: backendLocation,
      name: backendLocation,
      locationName: backendLocation,
    };
  }

  // If it's an ID (number or numeric string), look up in mockLocations
  const locationId = String(backendLocation);
  const foundLocation = mockLocations.find((loc) => loc.id === locationId);

  if (foundLocation) {
    return {
      id: foundLocation.id,
      name: foundLocation.name,
      locationName: foundLocation.name,
      type: foundLocation.type,
    };
  }

  // Fallback for unknown location
  return {
    id: "unknown",
    name: "Unknown Location",
    locationName: "Unknown Location",
  };
};

// Normalize backend Item to frontend-friendly shape (ensure images[])
const normalizeItem = (raw: any) => {
  let images: string[] = [];

  console.log("Raw item data for image processing:", {
    itemId: raw.itemId || raw.id,
    imageData: raw.imageData
      ? {
          type: typeof raw.imageData,
          length: raw.imageData.length,
          preview: `${raw.imageData.substring(0, 50)}...`,
          startsWithDataImage: raw.imageData.startsWith("data:image/"),
          isFilename:
            !raw.imageData.startsWith("data:image/") &&
            !raw.imageData.includes(","),
        }
      : null,
  });

  // Priority 1: Check if imageData is a filename and use upload URL
  if (
    raw.imageData &&
    typeof raw.imageData === "string" &&
    raw.imageData.trim() &&
    !raw.imageData.startsWith("data:image/") && // Not base64
    !raw.imageData.includes(",") // Not a data URL with comma separator
  ) {
    console.log("Raw imageData:", raw.imageData);
    const baseUrl =
      import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

    // Clean up the imageData to get just the filename
    let filename = raw.imageData.trim();

    // Remove any existing prefixes to get just the filename
    if (filename.startsWith("/api/uploads/files/")) {
      filename = filename.substring("/api/uploads/files/".length);
    } else if (filename.startsWith("api/uploads/files/")) {
      filename = filename.substring("api/uploads/files/".length);
    } else if (filename.startsWith("/api/uploads/")) {
      filename = filename.substring("/api/uploads/".length);
    } else if (filename.startsWith("api/uploads/")) {
      filename = filename.substring("api/uploads/".length);
    }

    // If it still contains slashes, extract just the last part (filename)
    if (filename.includes("/")) {
      filename = filename.split("/").pop() || filename;
    }

    console.log("Cleaned filename:", filename);

    // Build the final URL - make sure we only have one /api/uploads/files/ prefix
    const finalUrl = `${baseUrl}/api/uploads/files/${filename}`;
    console.log("Final URL:", finalUrl);

    images = [finalUrl];
  }
  // Priority 2: Handle base64 data URLs
  else if (
    raw.imageData &&
    typeof raw.imageData === "string" &&
    raw.imageData.startsWith("data:image/")
  ) {
    console.log("Using imageData field as base64");

    // Validate and clean base64 data
    const parts = raw.imageData.split(",");
    if (parts.length === 2) {
      const [header, base64Data] = parts;

      // Clean the base64 data
      const cleanedBase64 = base64Data
        .replace(/\s/g, "") // Remove all whitespace
        .replace(/[^A-Za-z0-9+/=]/g, ""); // Remove any non-base64 characters

      // Ensure base64 data is properly padded
      let paddedBase64 = cleanedBase64;
      while (paddedBase64.length % 4 !== 0) {
        paddedBase64 += "=";
      }

      const finalImageData = `${header},${paddedBase64}`;
      images = [finalImageData];
    } else {
      console.error("Invalid base64 imageData format");
      images = [raw.imageData]; // Use as-is and let validation catch it
    }
  }
  // Priority 3: Legacy support for other image fields (now disabled - use placeholders)
  else if (
    raw.itemImage &&
    typeof raw.itemImage === "string" &&
    raw.itemImage.trim()
  ) {
    console.log("Using itemImage field - legacy path, using placeholder");
    if (raw.itemImage.startsWith("data:image/")) {
      images = [raw.itemImage]; // Base64
    } else {
      images = ["/placeholder.jpg"]; // Use placeholder instead of legacy URL
    }
  }
  // Priority 4: Direct imagePath field (now disabled - use placeholders)
  else if (
    raw.imagePath &&
    typeof raw.imagePath === "string" &&
    raw.imagePath.trim()
  ) {
    console.log("Using imagePath field - legacy path, using placeholder");
    if (raw.imagePath.startsWith("data:image/")) {
      images = [raw.imagePath]; // Base64
    } else {
      images = ["/placeholder.jpg"]; // Use placeholder instead of legacy URL
    }
  }
  // Priority 5: Existing images array (now disabled - use placeholders)
  else if (Array.isArray(raw.images) && raw.images.length > 0) {
    console.log("Using images array - legacy path, using placeholder");
    images = raw.images.map((img: string) => {
      if (typeof img === "string" && img.startsWith("data:image/")) {
        return img; // Base64 - use as is
      }
      return "/placeholder.jpg"; // Use placeholder instead of legacy URL
    });
  }
  // Priority 6: Post imageUrls (legacy path disabled)
  else if (
    typeof raw.post?.imageUrls === "string" &&
    raw.post.imageUrls.length > 0
  ) {
    console.log("Using post.imageUrls - legacy path, using placeholder");
    if (raw.post.imageUrls.startsWith("data:image/")) {
      images = [raw.post.imageUrls]; // Base64 image - use as is
    } else {
      // Use placeholder for legacy post image URLs
      images = ["/placeholder.jpg"];
    }
  }

  console.log(
    "Final normalized images:",
    images.length > 0
      ? `${images.length} image(s), first: ${images[0].substring(0, 50)}...`
      : "No images found"
  );

  return {
    ...raw,
    // Map backend fields to frontend expected fields
    id: raw.itemId || raw.id,
    itemId: raw.itemId,
    title: raw.itemName || raw.title,
    itemName: raw.itemName,
    condition: raw.itemCondition || raw.condition,
    itemCondition: raw.itemCondition,
    type: raw.itemType || raw.type,
    itemType: raw.itemType,
    // Ensure category and location have proper structure
    category:
      typeof raw.category === "string"
        ? { id: raw.category, name: raw.category, categoryName: raw.category }
        : raw.category || {
            id: "uncategorized",
            name: "Uncategorized",
            categoryName: "Uncategorized",
          },
    location: mapLocationFromBackend(raw.location),
    images,
  };
};

// Message API calls
export const messageAPI = {
  getUserConversations: async (userId: number) => {
    const response = await apiClient.get(
      `/api/messages/conversations/${userId}`
    );
    return response.data;
  },

  getConversation: async (senderId: number, receiverId: number) => {
    const response = await apiClient.get(
      `/api/messages/conversation/${senderId}/${receiverId}`
    );
    return response.data;
  },

  sendMessage: async (messageData: {
    senderId: number;
    receiverId: number;
    text: string;
    itemId?: number;
  }) => {
    const response = await apiClient.post("/api/messages", messageData);
    return response.data;
  },

  markMessagesAsRead: async (conversationPartnerId: number) => {
    await apiClient.put(`/api/messages/mark-read/${conversationPartnerId}`);
  },

  deleteMessage: async (messageId: number) => {
    await apiClient.delete(`/api/messages/${messageId}`);
  },
};

// Wishlist API calls
export const wishlistAPI = {
  getUserWishlists: async (userId: number) => {
    const response = await apiClient.get(`/api/wishlist/user/${userId}`);
    const wishlists = response.data || [];
    return wishlists.map((w: any) => ({
      ...w,
      // Normalize nested items for consistent UI rendering
      items: Array.isArray(w.items) ? w.items.map(normalizeItem) : [],
    }));
  },

  addToWishlist: async (userId: number, itemId: number, notes: string) => {
    const response = await apiClient.post("/api/wishlist/add", {
      userId,
      itemId,
      notes,
    });
    return response.data;
  },

  removeFromWishlist: async (userId: number, itemId: number) => {
    await apiClient.delete("/api/wishlist/remove", {
      data: { userId, itemId },
    });
  },

  checkWishlistStatus: async (userId: number, itemId: number) => {
    const response = await apiClient.get(
      `/api/wishlist/check/${userId}/${itemId}`
    );
    return response.data;
  },

  updateWishlistNotes: async (wishlistId: number, notes: string) => {
    const response = await apiClient.put(`/api/wishlist/${wishlistId}/notes`, {
      notes,
    });
    return response.data;
  },
};

// Item API calls
export const itemAPI = {
  getAllItems: async () => {
    const response = await apiClient.get("/api/items");
    const items = response.data || [];
    return items.map(normalizeItem);
  },

  getAvailableItems: async () => {
    const response = await apiClient.get("/api/items/available");
    const items = response.data || [];
    return items.map(normalizeItem);
  },

  getItemById: async (itemId: number) => {
    const response = await apiClient.get(`/api/items/${itemId}`);
    return normalizeItem(response.data);
  },

  getUserItems: async (userId: number) => {
    const response = await apiClient.get(`/api/items/user/${userId}`);
    const items = response.data || [];
    return items.map(normalizeItem);
  },

  createItem: async (itemData: any) => {
    const response = await apiClient.post("/api/items", itemData);
    return response.data;
  },

  updateItem: async (itemId: number, itemData: any) => {
    const response = await apiClient.put(`/api/items/${itemId}`, itemData);
    return response.data;
  },

  deleteItem: async (itemId: number) => {
    await apiClient.delete(`/api/items/${itemId}`);
  },

  markAsExchanged: async (itemId: number) => {
    const response = await apiClient.put(`/api/items/${itemId}/exchange`);
    return response.data;
  },
};

// Borrow records API calls
export const borrowRecordAPI = {
  getLentRecords: async (userId: number) => {
    const response = await apiClient.get(
      `/api/borrow-records/lender/${userId}`
    );
    return response.data;
  },
  getBorrowedRecords: async (userId: number) => {
    const response = await apiClient.get(
      `/api/borrow-records/borrower/${userId}`
    );
    return response.data;
  },
};

// Tuition API calls
export const tuitionAPI = {
  getAllTuitions: async () => {
    const response = await apiClient.get("/api/tuitions");
    return response.data;
  },

  getTuitionById: async (tuitionId: number) => {
    const response = await apiClient.get(`/api/tuitions/${tuitionId}`);
    return response.data;
  },

  getUserTuitions: async (userId: number) => {
    const response = await apiClient.get(`/api/tuitions/user/${userId}`);
    return response.data;
  },

  getTuitionsByStatus: async (status: string) => {
    const response = await apiClient.get(`/api/tuitions/status/${status}`);
    return response.data;
  },

  getTuitionsBySubject: async (subject: string) => {
    const response = await apiClient.get(`/api/tuitions/subject/${subject}`);
    return response.data;
  },

  getTuitionsByLocation: async (locationId: number) => {
    const response = await apiClient.get(
      `/api/tuitions/location/${locationId}`
    );
    return response.data;
  },

  getTuitionsBySalaryRange: async (maxSalary: number) => {
    const response = await apiClient.get(
      `/api/tuitions/salary/max/${maxSalary}`
    );
    return response.data;
  },

  createTuition: async (tuitionData: any, userId: number) => {
    const response = await apiClient.post(
      `/api/tuitions?userId=${userId}`,
      tuitionData
    );
    return response.data;
  },

  updateTuition: async (tuitionId: number, tuitionData: any) => {
    const response = await apiClient.put(
      `/api/tuitions/${tuitionId}`,
      tuitionData
    );
    return response.data;
  },

  deleteTuition: async (tuitionId: number) => {
    await apiClient.delete(`/api/tuitions/${tuitionId}`);
  },

  markAsTaken: async (tuitionId: number) => {
    const response = await apiClient.put(`/api/tuitions/${tuitionId}/take`);
    return response.data;
  },

  markAsCompleted: async (tuitionId: number) => {
    const response = await apiClient.put(`/api/tuitions/${tuitionId}/complete`);
    return response.data;
  },
};
