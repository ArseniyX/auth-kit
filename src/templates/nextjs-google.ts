export const nextJsGoogleCallback = `// Google OAuth callback for Next.js
import { NextRequest, NextResponse } from 'next/server';

interface GoogleTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  error?: string;
  error_description?: string;
}

interface GoogleUser {
  id: string;
  email: string;
  name: string;
  picture: string;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  if (error) {
    console.error('Google OAuth error:', error);
    return NextResponse.redirect(new URL('/login?error=oauth_error', request.url));
  }

  if (!code) {
    return NextResponse.redirect(new URL('/login?error=missing_code', request.url));
  }

  try {
    // Exchange code for access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        code,
        grant_type: 'authorization_code',
        redirect_uri: \`\${process.env.NEXTAUTH_URL}/auth/google/callback\`,
      }),
    });

    const tokens: GoogleTokenResponse = await tokenResponse.json();
    
    if (tokens.error) {
      throw new Error(tokens.error_description || tokens.error);
    }

    // Get user info
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: \`Bearer \${tokens.access_token}\`,
      },
    });

    const user: GoogleUser = await userResponse.json();

    // Handle user authentication here
    // You might want to create a session, JWT, or store user data
    console.log('Google user:', user);

    return NextResponse.redirect(new URL('/dashboard', request.url));
  } catch (error) {
    console.error('Google OAuth callback error:', error);
    return NextResponse.redirect(new URL('/login?error=callback_error', request.url));
  }
}
`;

export const nextJsGoogleRoute = `// Google OAuth initiation for Next.js
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  
  googleAuthUrl.searchParams.append('client_id', process.env.GOOGLE_CLIENT_ID!);
  googleAuthUrl.searchParams.append('redirect_uri', \`\${process.env.NEXTAUTH_URL}/auth/google/callback\`);
  googleAuthUrl.searchParams.append('response_type', 'code');
  googleAuthUrl.searchParams.append('scope', 'openid profile email');
  googleAuthUrl.searchParams.append('access_type', 'offline');
  googleAuthUrl.searchParams.append('prompt', 'consent');

  return NextResponse.redirect(googleAuthUrl.toString());
}
`;