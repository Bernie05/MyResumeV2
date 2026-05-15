/**
 * API request and error handling utilities
 */

import { API_ENDPOINTS, ERROR_MESSAGES } from "./constants";

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode?: number;
}

export interface ApiError {
  message: string;
  statusCode?: number;
  details?: any;
}

/**
 * Makes a fetch request with error handling
 */
export const apiCall = async <T = any>(
  endpoint: string,
  options?: RequestInit,
): Promise<ApiResponse<T>> => {
  try {
    const response = await fetch(endpoint, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || ERROR_MESSAGES.NETWORK_ERROR,
        statusCode: response.status,
      };
    }

    return {
      success: true,
      data: data as T,
      statusCode: response.status,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : ERROR_MESSAGES.NETWORK_ERROR,
      statusCode: 500,
    };
  }
};

/**
 * GET request
 */
export const apiGet = async <T = any>(
  endpoint: string,
): Promise<ApiResponse<T>> => {
  return apiCall<T>(endpoint, { method: "GET" });
};

/**
 * POST request
 */
export const apiPost = async <T = any>(
  endpoint: string,
  data: any,
): Promise<ApiResponse<T>> => {
  return apiCall<T>(endpoint, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

/**
 * PUT request
 */
export const apiPut = async <T = any>(
  endpoint: string,
  data: any,
): Promise<ApiResponse<T>> => {
  return apiCall<T>(endpoint, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

/**
 * PATCH request
 */
export const apiPatch = async <T = any>(
  endpoint: string,
  data: any,
): Promise<ApiResponse<T>> => {
  return apiCall<T>(endpoint, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
};

/**
 * DELETE request
 */
export const apiDelete = async <T = any>(
  endpoint: string,
): Promise<ApiResponse<T>> => {
  return apiCall<T>(endpoint, { method: "DELETE" });
};

/**
 * Uploads a file
 */
export const apiUploadFile = async <T = any>(
  file: File,
  additionalData?: Record<string, any>,
): Promise<ApiResponse<T>> => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, JSON.stringify(value));
      });
    }

    const response = await fetch(API_ENDPOINTS.UPLOAD, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || ERROR_MESSAGES.NETWORK_ERROR,
        statusCode: response.status,
      };
    }

    return {
      success: true,
      data: data as T,
      statusCode: response.status,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : ERROR_MESSAGES.NETWORK_ERROR,
      statusCode: 500,
    };
  }
};

/**
 * Retry logic for failed requests
 */
export const apiWithRetry = async <T = any>(
  fn: () => Promise<ApiResponse<T>>,
  maxRetries: number = 3,
  delay: number = 1000,
): Promise<ApiResponse<T>> => {
  let lastError: ApiResponse<T> | null = null;

  for (let i = 0; i < maxRetries; i++) {
    const result = await fn();

    if (result.success) {
      return result;
    }

    lastError = result;

    if (i < maxRetries - 1) {
      await new Promise((resolve) =>
        setTimeout(resolve, delay * Math.pow(2, i)),
      );
    }
  }

  return lastError || { success: false, error: ERROR_MESSAGES.NETWORK_ERROR };
};

/**
 * Resume API calls
 */
export const resumeApi = {
  fetch: async () => apiGet(API_ENDPOINTS.RESUME),
  save: async (data: any) => apiPost(API_ENDPOINTS.RESUME_SAVE, data),
  update: async (data: any) => apiPut(API_ENDPOINTS.RESUME, data),
};

/**
 * Auth API calls
 */
export const authApi = {
  signin: async (credentials: any) =>
    apiPost(API_ENDPOINTS.AUTH_SIGNIN, credentials),
  signout: async () => apiPost(API_ENDPOINTS.AUTH_SIGNOUT, {}),
};

/**
 * Builds query string from parameters
 */
export const buildQueryString = (params: Record<string, any>): string => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      if (Array.isArray(value)) {
        value.forEach((v) => searchParams.append(key, String(v)));
      } else {
        searchParams.append(key, String(value));
      }
    }
  });

  return searchParams.toString();
};

/**
 * Builds URL with query parameters
 */
export const buildUrl = (
  baseUrl: string,
  params?: Record<string, any>,
): string => {
  if (!params || Object.keys(params).length === 0) {
    return baseUrl;
  }

  const queryString = buildQueryString(params);
  return `${baseUrl}?${queryString}`;
};

/**
 * Handles API errors and returns user-friendly messages
 */
export const getErrorMessage = (error: any): string => {
  if (typeof error === "string") {
    return error;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (error?.message) {
    return error.message;
  }

  if (error?.statusCode === 401) {
    return "Unauthorized. Please sign in again.";
  }

  if (error?.statusCode === 403) {
    return "You don't have permission to perform this action.";
  }

  if (error?.statusCode === 404) {
    return "Resource not found.";
  }

  if (error?.statusCode === 500) {
    return "Server error. Please try again later.";
  }

  return ERROR_MESSAGES.NETWORK_ERROR;
};
