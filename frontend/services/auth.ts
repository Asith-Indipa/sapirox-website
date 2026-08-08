import { apiFetch } from './api';

export interface User {
  id: string;
  email: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'EDITOR';
  name?: string;
}

export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('sapirox_auth_token');
  }
  return null;
};

export const setAuthToken = (token: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('sapirox_auth_token', token);
  }
};

export const removeAuthToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('sapirox_auth_token');
  }
};

export const getCurrentUser = async (): Promise<User | null> => {
  const token = getAuthToken();
  if (!token) return null;
  try {
    const res = await apiFetch<{ success: boolean; data: { user: User } }>('/auth/me');
    return res.data?.user || null;
  } catch (error) {
    console.error('Failed to get current user:', error);
    removeAuthToken();
    return null;
  }
};
