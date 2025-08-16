import { nextJsGoogleCallback, nextJsGoogleRoute } from './nextjs-google';
import { nextJsGitHubCallback, nextJsGitHubRoute } from './nextjs-github';
import { payloadGoogleCallback, payloadGoogleRoute } from './payload-google';
import { payloadGitHubCallback, payloadGitHubRoute } from './payload-github';
import { Framework, Provider } from '../types';

export class TemplateProvider {
  static getTemplate(framework: Framework, provider: Provider, type: 'callback' | 'route'): string {
    if (framework === 'Next.js') {
      if (provider === 'google') {
        return type === 'callback' ? nextJsGoogleCallback : nextJsGoogleRoute;
      } else if (provider === 'github') {
        return type === 'callback' ? nextJsGitHubCallback : nextJsGitHubRoute;
      }
    } else if (framework === 'Payload CMS') {
      if (provider === 'google') {
        return type === 'callback' ? payloadGoogleCallback : payloadGoogleRoute;
      } else if (provider === 'github') {
        return type === 'callback' ? payloadGitHubCallback : payloadGitHubRoute;
      }
    }

    throw new Error(`Template not found for framework: ${framework}, provider: ${provider}, type: ${type}`);
  }

  static getAuthConfig(providers: Provider[], framework: Framework): string {
    return `// Auth configuration
interface AuthConfig {
  providers: string[];
  framework: string;
  redirectUrl: string;
}

export const authConfig: AuthConfig = {
  providers: [${providers.map(p => `'${p}'`).join(', ')}],
  framework: '${framework}',
  redirectUrl: process.env.NEXTAUTH_URL || process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000'
};
`;
  }
}