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

// Helper function to add proper URL prefix for images
const addImagePrefix = (imagePath: string): string => {
  if (!imagePath) return "";
  // If it's already a full URL, return as-is
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://") || imagePath.startsWith("/api/")) {
    return imagePath;
  }
  // Otherwise, prepend the backend URL
  return `http://localhost:8080/api/uploads/files/${imagePath}`;
};

// Normalize backend Item to frontend-friendly shape (ensure images[])
const normalizeItem = (raw: any) => {
  const images: string[] =
    Array.isArray(raw.images) && raw.images.length > 0
      ? raw.images.map(addImagePrefix)
      : typeof raw.post?.imageUrls === "string" && raw.post.imageUrls.length > 0
      ? raw.post.imageUrls
          .split(",")
          .map((s: string) => s.trim())
          .filter(Boolean)
          .map(addImagePrefix)
      : [];
  return {
    ...raw,
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
