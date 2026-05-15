/**
 * Global constants and enumerations
 */

/**
 * Application-wide status constants
 */
export const APP_STATUS = {
  IDLE: "idle",
  LOADING: "loading",
  SUCCESS: "success",
  ERROR: "error",
} as const;

/**
 * Auth status types
 */
export const AUTH_STATUS = {
  IDLE: "idle",
  SUBMITTING: "submitting",
  AUTHENTICATED: "authenticated",
  ERROR: "error",
} as const;

/**
 * Resume sections
 */
export const RESUME_SECTIONS = {
  PERSONAL_INFO: "personalInfo",
  EXPERIENCE: "experience",
  EDUCATION: "education",
  SKILLS: "skills",
  CERTIFICATIONS: "certifications",
  PROJECTS: "projects",
  PORTFOLIO: "portfolio",
  SERVICES: "services",
} as const;

/**
 * Common breakpoints for responsive design
 */
export const BREAKPOINTS = {
  XS: 0,
  SM: 600,
  MD: 960,
  LG: 1280,
  XL: 1920,
} as const;

/**
 * Animation durations (ms)
 */
export const ANIMATION_DURATION = {
  INSTANT: 0,
  FAST: 160,
  NORMAL: 300,
  SLOW: 500,
  SLOWER: 800,
} as const;

/**
 * Local storage keys
 */
export const STORAGE_KEYS = {
  THEME: "app_theme",
  USER_PREFERENCES: "user_preferences",
  RESUME_DRAFT: "resume_draft",
  AUTH_TOKEN: "auth_token",
  LAST_SAVED: "last_saved",
} as const;

/**
 * API endpoints
 */
export const API_ENDPOINTS = {
  AUTH_SIGNIN: "/api/auth/signin",
  AUTH_SIGNOUT: "/api/auth/signout",
  AUTH_CALLBACK: "/api/auth/callback",
  RESUME: "/api/resume",
  RESUME_SAVE: "/api/resume/save",
  UPLOAD: "/api/upload",
} as const;

/**
 * Error messages
 */
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: "This field is required",
  INVALID_EMAIL: "Please enter a valid email address",
  INVALID_URL: "Please enter a valid URL",
  INVALID_PHONE: "Please enter a valid phone number",
  NETWORK_ERROR: "Network error. Please try again.",
  LOAD_ERROR: "Failed to load data",
  SAVE_ERROR: "Failed to save data",
  AUTH_ERROR: "Authentication failed",
  UNAUTHORIZED: "You are not authorized",
  NOT_FOUND: "Resource not found",
} as const;

/**
 * Success messages
 */
export const SUCCESS_MESSAGES = {
  SAVED: "Changes saved successfully",
  CREATED: "Item created successfully",
  DELETED: "Item deleted successfully",
  UPDATED: "Item updated successfully",
  SIGNED_IN: "Signed in successfully",
  SIGNED_OUT: "Signed out successfully",
} as const;

/**
 * Skill proficiency levels
 */
export const PROFICIENCY_LEVELS = {
  BEGINNER: 25,
  INTERMEDIATE: 50,
  ADVANCED: 75,
  EXPERT: 100,
} as const;

/**
 * Project status
 */
export const PROJECT_STATUS = {
  ACTIVE: "active",
  COMPLETED: "completed",
  ARCHIVED: "archived",
  PLANNED: "planned",
} as const;

/**
 * Theme modes
 */
export const THEME_MODES = {
  LIGHT: "light",
  DARK: "dark",
  AUTO: "auto",
} as const;

/**
 * Validation patterns
 */
export const VALIDATION_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  URL: /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
  PHONE: /^[\d\s\-\+\(\)]{10,}$/,
  SLUG: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
} as const;

/**
 * Default values
 */
export const DEFAULTS = {
  IMAGE_PLACEHOLDER: "https://via.placeholder.com/400x300?text=No+Image",
  AVATAR_SIZE: 48,
  ITEMS_PER_PAGE: 10,
  DEBOUNCE_DELAY: 300,
  THROTTLE_DELAY: 1000,
} as const;
