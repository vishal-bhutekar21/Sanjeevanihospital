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

// Must match the keys AdminAuthContext writes on login
export const ADMIN_TOKEN_KEY = 'sanjeevani_admin_token';
export const ADMIN_USER_KEY = 'sanjeevani_admin_user';

export const getAdminToken = (): string | null => localStorage.getItem(ADMIN_TOKEN_KEY);

export const getAuthHeaders = (): Record<string, string> => {
  const token = getAdminToken();
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
    ...(getAdminToken() ? { Authorization: `Bearer ${getAdminToken()}` } : {}),
    ...(options.headers || {}),
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401 && getAdminToken()) {
    // Staff login expired: clear it and go back to sign-in
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    localStorage.removeItem(ADMIN_USER_KEY);
    window.location.assign('/admin/login?expired=1');
  }

  const json = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(json.error?.message || json.message || `API Error: ${response.status}`);
  }

  return json;
}
