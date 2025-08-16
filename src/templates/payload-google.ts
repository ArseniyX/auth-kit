export const payloadGoogleCallback = `// Google OAuth callback for Payload CMS
import { Request, Response } from 'express';

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

export default async (req: Request, res: Response) => {
  const { code, error } = req.query;

  if (error) {
    console.error('Google OAuth error:', error);
    return res.redirect('/login?error=oauth_error');
  }

  if (!code || typeof code !== 'string') {
    return res.redirect('/login?error=missing_code');
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
        redirect_uri: \`\${process.env.PAYLOAD_PUBLIC_SERVER_URL}/auth/google/callback\`,
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

    // Handle user authentication with Payload
    // You might want to find or create user in Payload
    console.log('Google user:', user);

    res.redirect('/admin');
  } catch (error) {
    console.error('Google OAuth callback error:', error);
    res.redirect('/login?error=callback_error');
  }
};
`;

export const payloadGoogleRoute = `// Google OAuth initiation for Payload CMS
import { Request, Response } from 'express';

export default (req: Request, res: Response) => {
  const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  
  googleAuthUrl.searchParams.append('client_id', process.env.GOOGLE_CLIENT_ID!);
  googleAuthUrl.searchParams.append('redirect_uri', \`\${process.env.PAYLOAD_PUBLIC_SERVER_URL}/auth/google/callback\`);
  googleAuthUrl.searchParams.append('response_type', 'code');
  googleAuthUrl.searchParams.append('scope', 'openid profile email');
  googleAuthUrl.searchParams.append('access_type', 'offline');
  googleAuthUrl.searchParams.append('prompt', 'consent');

  res.redirect(googleAuthUrl.toString());
};
`;