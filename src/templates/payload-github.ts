export const payloadGitHubCallback = `// GitHub OAuth callback for Payload CMS
import { Request, Response } from 'express';

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

export default async (req: Request, res: Response) => {
  const { code, error } = req.query;

  if (error) {
    console.error('GitHub OAuth error:', error);
    return res.redirect('/login?error=oauth_error');
  }

  if (!code || typeof code !== 'string') {
    return res.redirect('/login?error=missing_code');
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

    // Handle user authentication with Payload
    // You might want to find or create user in Payload
    console.log('GitHub user:', user);

    res.redirect('/admin');
  } catch (error) {
    console.error('GitHub OAuth callback error:', error);
    res.redirect('/login?error=callback_error');
  }
};
`;

export const payloadGitHubRoute = `// GitHub OAuth initiation for Payload CMS
import { Request, Response } from 'express';

export default (req: Request, res: Response) => {
  const githubAuthUrl = new URL('https://github.com/login/oauth/authorize');
  
  githubAuthUrl.searchParams.append('client_id', process.env.GITHUB_CLIENT_ID!);
  githubAuthUrl.searchParams.append('redirect_uri', \`\${process.env.PAYLOAD_PUBLIC_SERVER_URL}/auth/github/callback\`);
  githubAuthUrl.searchParams.append('scope', 'user:email');
  githubAuthUrl.searchParams.append('state', Math.random().toString(36).substring(7));

  res.redirect(githubAuthUrl.toString());
};
`;