/**
 * Authentication utilities for password protection
 */

const AUTH_TOKEN_KEY = 'auth_token';
const AUTH_TIMESTAMP_KEY = 'auth_timestamp';
const TOKEN_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Check if user is authenticated
 * @returns {boolean}
 */
export function isAuthenticated() {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  const timestamp = localStorage.getItem(AUTH_TIMESTAMP_KEY);
  
  if (!token || !timestamp) {
    return false;
  }
  
  // Check if token is older than 24 hours
  const now = Date.now();
  const tokenAge = now - parseInt(timestamp, 10);
  
  if (tokenAge > TOKEN_EXPIRY_MS) {
    // Token expired, clear it
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_TIMESTAMP_KEY);
    return false;
  }
  
  return true;
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
  localStorage.removeItem(AUTH_TIMESTAMP_KEY);
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
