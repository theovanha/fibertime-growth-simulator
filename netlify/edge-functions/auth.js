/**
 * Netlify Edge Function for password authentication
 * Handles login and token verification
 */

// Generate a simple session token
function generateToken() {
  return btoa(Date.now() + Math.random().toString()).slice(0, 32);
}

export default async (request, context) => {
  const url = new URL(request.url);
  const path = url.pathname;

  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  // Handle preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers });
  }

  try {
    // Login endpoint
    if (path === '/api/auth/login' && request.method === 'POST') {
      const { password } = await request.json();
      const correctPassword = Deno.env.get('SITE_PASSWORD') || 'demo2026';

      if (password === correctPassword) {
        const token = generateToken();
        
        return new Response(
          JSON.stringify({ success: true, token }),
          { status: 200, headers }
        );
      } else {
        return new Response(
          JSON.stringify({ success: false, message: 'Invalid password' }),
          { status: 401, headers }
        );
      }
    }

    // Verify endpoint
    if (path === '/api/auth/verify' && request.method === 'POST') {
      const { token } = await request.json();
      
      // Simple token validation - just check if it exists and has correct format
      const isValid = token && token.length >= 20;
      
      return new Response(
        JSON.stringify({ valid: isValid }),
        { status: isValid ? 200 : 401, headers }
      );
    }

    // Default response
    return new Response(
      JSON.stringify({ error: 'Not found' }),
      { status: 404, headers }
    );
    
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers }
    );
  }
};

export const config = {
  path: "/api/auth/*",
};
