// src/utils/imageUtils.ts
import { getAvatarById } from "./avatars";

/**
 * Get the full URL for a profile picture
 * @param profilePicture - The profile picture string from the backend
 * @returns The full URL to display the image
 */
export function getProfilePictureUrl(
  profilePicture: string | null | undefined
): string {
  if (!profilePicture) {
    // Return a default avatar instead of a missing image
    return createEmojiDataUrl("🙂");
  }

  // Check if it's an avatar ID first
  const avatar = getAvatarById(profilePicture);
  if (avatar) {
    // Return a data URL with the emoji as an SVG
    return createEmojiDataUrl(avatar.emoji);
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
  return createEmojiDataUrl("🙂");
}

/**
 * Create a data URL from an emoji for use as an avatar
 * @param emoji - The emoji character
 * @returns Data URL string
 */
export function createEmojiDataUrl(emoji: string): string {
  const svg = `
    <svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <text x="32" y="44" font-family="system-ui, -apple-system, sans-serif" font-size="48" text-anchor="middle">${emoji}</text>
    </svg>
  `;

  // Use URL encoding instead of base64 to handle Unicode characters
  const encodedSvg = encodeURIComponent(svg);
  return `data:image/svg+xml;charset=utf-8,${encodedSvg}`;
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
