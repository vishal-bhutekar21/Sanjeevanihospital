/**
 * Sanjeevani Multispeciality Hospital — Centralized API Configuration
 * Supports environment overrides via VITE_API_URL or defaults to local backend
 */

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const apiUrl = (endpoint: string): string => {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${API_BASE_URL}/${cleanEndpoint}`;
};

export const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export async function apiFetch<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data: T; message?: string }> {
  const url = apiUrl(endpoint);
  const headers = {
    'Content-Type': 'application/json',
    ...(localStorage.getItem('token')
      ? { Authorization: `Bearer ${localStorage.getItem('token')}` }
      : {}),
    ...(options.headers || {}),
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const json = await response.json();
  if (!response.ok) {
    throw new Error(json.error?.message || json.message || `API Error: ${response.status}`);
  }

  return json;
}
