const API_BASE_PATH = import.meta.env.VITE_API_BASE_PATH || "/api";

export const apiFetch = async (endpoint: string, options?: RequestInit) => {
  const response = await fetch(`${API_BASE_PATH}${endpoint}`, options);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${endpoint}: ${response.statusText}`);
  }
  return response.json();
};
