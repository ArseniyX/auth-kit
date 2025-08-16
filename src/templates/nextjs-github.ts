export const nextJsGitHubCallback = `// GitHub OAuth callback for Next.js
import { NextRequest, NextResponse } from 'next/server';

interface GitHubTokenResponse {
  access_token: string;
  token_type: string;
  scope: string;
  error?: string;
  error_description?: string;
}

interface GitHubUser {
  id: number;
  login: string;
  email: string;
  name: string;
  avatar_url: string;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  if (error) {
    console.error('GitHub OAuth error:', error);
    return NextResponse.redirect(new URL('/login?error=oauth_error', request.url));
  }

  if (!code) {
    return NextResponse.redirect(new URL('/login?error=missing_code', request.url));
  }

  try {
    // Exchange code for access token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID!,
        client_secret: process.env.GITHUB_CLIENT_SECRET!,
        code,
      }),
    });

    const tokens: GitHubTokenResponse = await tokenResponse.json();
    
    if (tokens.error) {
      throw new Error(tokens.error_description || tokens.error);
    }

    // Get user info
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: \`Bearer \${tokens.access_token}\`,
      },
    });

    const user: GitHubUser = await userResponse.json();

    // Handle user authentication here
    // You might want to create a session, JWT, or store user data
    console.log('GitHub user:', user);

    return NextResponse.redirect(new URL('/dashboard', request.url));
  } catch (error) {
    console.error('GitHub OAuth callback error:', error);
    return NextResponse.redirect(new URL('/login?error=callback_error', request.url));
  }
}
`;

export const nextJsGitHubRoute = `// GitHub OAuth initiation for Next.js
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const githubAuthUrl = new URL('https://github.com/login/oauth/authorize');
  
  githubAuthUrl.searchParams.append('client_id', process.env.GITHUB_CLIENT_ID!);
  githubAuthUrl.searchParams.append('redirect_uri', \`\${process.env.NEXTAUTH_URL}/auth/github/callback\`);
  githubAuthUrl.searchParams.append('scope', 'user:email');
  githubAuthUrl.searchParams.append('state', Math.random().toString(36).substring(7));

  return NextResponse.redirect(githubAuthUrl.toString());
}
`;