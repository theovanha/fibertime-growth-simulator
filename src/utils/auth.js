/**
 * Authentication utilities for password protection
 */

const AUTH_TOKEN_KEY = 'auth_token';

/**
 * Check if user is authenticated
 * @returns {boolean}
 */
export function isAuthenticated() {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  return !!token;
}

/**
 * Get stored auth token
 * @returns {string|null}
 */
export function getAuthToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

/**
 * Clear authentication (logout)
 */
export function logout() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  window.location.reload();
}

/**
 * Verify token with server (optional - for added security)
 * @returns {Promise<boolean>}
 */
export async function verifyToken() {
  const token = getAuthToken();
  if (!token) return false;

  try {
    const response = await fetch('/api/auth/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });

    return response.ok;
  } catch (err) {
    console.error('Token verification failed:', err);
    return false;
  }
}
