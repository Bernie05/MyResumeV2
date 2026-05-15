/**
 * Text and data formatting utilities
 */

/**
 * Formats a date string to a readable format
 */
export const formatDate = (
  dateString: string,
  format: "short" | "long" = "short",
): string => {
  if (!dateString) return "";

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  if (format === "short") {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  }

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/**
 * Capitalizes the first letter of a string
 */
export const capitalize = (str: string): string => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Converts a string to title case
 */
export const toTitleCase = (str: string): string => {
  if (!str) return "";
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

/**
 * Truncates text to a maximum length with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
};

/**
 * Converts an array of strings to a human-readable list
 */
export const formatList = (
  items: string[],
  separator: "and" | "or" = "and",
): string => {
  if (!items || items.length === 0) return "";
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} ${separator} ${items[1]}`;

  return (
    items.slice(0, -1).join(", ") + `, ${separator} ${items[items.length - 1]}`
  );
};

/**
 * Sanitizes a string for use as an HTML ID
 */
export const sanitizeId = (str: string): string => {
  return str
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]/g, "");
};

/**
 * Extracts initials from a full name
 */
export const getInitials = (name: string): string => {
  if (!name) return "";
  return name
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase())
    .join("")
    .slice(0, 2);
};

/**
 * Converts minutes to a readable duration string
 */
export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;

  return `${hours}h ${mins}m`;
};

/**
 * Formats a number with commas for thousands
 */
export const formatNumber = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

/**
 * Extracts domain from URL
 */
export const extractDomain = (url: string): string => {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace("www.", "");
  } catch {
    return url;
  }
};
