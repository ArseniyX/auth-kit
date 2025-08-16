export interface PackageJson {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

export type Framework = 'Next.js' | 'Payload CMS' | null;
export type Provider = 'google' | 'github';

export interface AuthConfig {
  providers: Provider[];
  framework: Framework;
  redirectUrl: string;
}

export interface GoogleTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  error?: string;
  error_description?: string;
}

export interface GoogleUser {
  id: string;
  email: string;
  name: string;
  picture: string;
}

export interface GitHubTokenResponse {
  access_token: string;
  token_type: string;
  scope: string;
  error?: string;
  error_description?: string;
}

export interface GitHubUser {
  id: number;
  login: string;
  email: string;
  name: string;
  avatar_url: string;
}