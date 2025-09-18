// src/utils/imageUtils.ts

/**
 * Get the full URL for a profile picture
 * @param profilePicture - The profile picture string from the backend
 * @returns The full URL to display the image
 */
export function getProfilePictureUrl(
  profilePicture: string | null | undefined
): string {
  if (!profilePicture) {
    return "/default-avatar.png";
  }

  // If it's already a full URL (starts with http/https), return as is
  if (
    profilePicture.startsWith("http://") ||
    profilePicture.startsWith("https://")
  ) {
    return profilePicture;
  }

  // If it's a base64 data URL, return as is
  if (profilePicture.startsWith("data:image/")) {
    return profilePicture;
  }

  // If it starts with /api/uploads/, return as is (already properly formatted)
  if (profilePicture.startsWith("/api/uploads/")) {
    return profilePicture;
  }

  // If it's just a filename, construct the full path
  if (profilePicture.trim() !== "") {
    return `/api/uploads/${profilePicture}`;
  }

  // Fallback to default avatar
  return "/default-avatar.png";
}

/**
 * Convert a file to a data URL for immediate preview
 * @param file - The file to convert
 * @returns Promise that resolves to the data URL
 */
export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
