// src/utils/dateUtils.ts

/**
 * Get the best available date from an item object
 */
export function getBestItemDate(item: any): string | undefined {
  // Priority order: createdAt is most reliable, then dateCreated, postDate, etc.
  return (
    item.createdAt ||
    item.dateCreated ||
    item.postDate ||
    item.updatedAt ||
    item.timestamp ||
    item.post?.postTime
  );
}

/**
 * Format date for detailed view (shows full date and time)
 * Example: "Sep 19, 2025 at 2:30 PM"
 */
export function formatDetailedDate(dateString?: string): string {
  if (!dateString) return "Date not available";

  try {
    const date = new Date(dateString);

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return "Invalid date";
    }

    // Format as: "Sep 19, 2025 at 2:30 PM"
    const dateOptions: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };

    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    };

    const formattedDate = date.toLocaleDateString("en-US", dateOptions);
    const formattedTime = date.toLocaleTimeString("en-US", timeOptions);

    return `${formattedDate} at ${formattedTime}`;
  } catch (error) {
    console.error("Date parsing error:", error);
    return "Invalid date";
  }
}

/**
 * Format date for list view (shows relative time for recent items, full date for old items)
 * Example: "2h ago", "3d ago", or "Sep 15, 2025"
 */
export function formatRelativeDate(dateString?: string): string {
  if (!dateString) return "Date not available";

  try {
    const date = new Date(dateString);
    const now = new Date();

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return "Invalid date";
    }

    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) {
      return "Just posted";
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInHours < 168) {
      // 7 days
      return `${Math.floor(diffInHours / 24)}d ago`;
    } else {
      // For older items, show the full date
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }
  } catch (error) {
    console.error("Date parsing error:", error);
    return "Invalid date";
  }
}
