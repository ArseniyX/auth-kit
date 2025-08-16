import { TemplateProvider } from '../src/templates';

describe('TemplateProvider', () => {
  describe('getTemplate', () => {
    it('should return Next.js Google callback template', () => {
      const template = TemplateProvider.getTemplate('Next.js', 'google', 'callback');
      
      expect(template).toContain('// Google OAuth callback for Next.js');
      expect(template).toContain('NextRequest');
      expect(template).toContain('NextResponse');
      expect(template).toContain('GoogleTokenResponse');
      expect(template).toContain('GoogleUser');
    });

    it('should return Next.js Google route template', () => {
      const template = TemplateProvider.getTemplate('Next.js', 'google', 'route');
      
      expect(template).toContain('// Google OAuth initiation for Next.js');
      expect(template).toContain('NextRequest');
      expect(template).toContain('NextResponse');
      expect(template).toContain('accounts.google.com');
    });

    it('should return Next.js GitHub callback template', () => {
      const template = TemplateProvider.getTemplate('Next.js', 'github', 'callback');
      
      expect(template).toContain('// GitHub OAuth callback for Next.js');
      expect(template).toContain('GitHubTokenResponse');
      expect(template).toContain('GitHubUser');
      expect(template).toContain('github.com/login/oauth/access_token');
    });

    it('should return Next.js GitHub route template', () => {
      const template = TemplateProvider.getTemplate('Next.js', 'github', 'route');
      
      expect(template).toContain('// GitHub OAuth initiation for Next.js');
      expect(template).toContain('github.com/login/oauth/authorize');
    });

    it('should return Payload CMS Google callback template', () => {
      const template = TemplateProvider.getTemplate('Payload CMS', 'google', 'callback');
      
      expect(template).toContain('// Google OAuth callback for Payload CMS');
      expect(template).toContain('Request, Response');
      expect(template).toContain('express');
    });

    it('should return Payload CMS Google route template', () => {
      const template = TemplateProvider.getTemplate('Payload CMS', 'google', 'route');
      
      expect(template).toContain('// Google OAuth initiation for Payload CMS');
      expect(template).toContain('Request, Response');
    });

    it('should return Payload CMS GitHub callback template', () => {
      const template = TemplateProvider.getTemplate('Payload CMS', 'github', 'callback');
      
      expect(template).toContain('// GitHub OAuth callback for Payload CMS');
      expect(template).toContain('Request, Response');
    });

    it('should return Payload CMS GitHub route template', () => {
      const template = TemplateProvider.getTemplate('Payload CMS', 'github', 'route');
      
      expect(template).toContain('// GitHub OAuth initiation for Payload CMS');
      expect(template).toContain('Request, Response');
    });

    it('should throw error for unsupported framework', () => {
      expect(() => {
        // @ts-ignore - testing invalid input
        TemplateProvider.getTemplate('Unsupported', 'google', 'callback');
      }).toThrow('Template not found for framework: Unsupported, provider: google, type: callback');
    });

    it('should throw error for unsupported provider', () => {
      expect(() => {
        // @ts-ignore - testing invalid input
        TemplateProvider.getTemplate('Next.js', 'facebook', 'callback');
      }).toThrow('Template not found for framework: Next.js, provider: facebook, type: callback');
    });
  });

  describe('getAuthConfig', () => {
    it('should generate auth config for Next.js with Google and GitHub', () => {
      const config = TemplateProvider.getAuthConfig(['google', 'github'], 'Next.js');
      
      expect(config).toContain("providers: ['google', 'github']");
      expect(config).toContain("framework: 'Next.js'");
      expect(config).toContain('process.env.NEXTAUTH_URL');
      expect(config).toContain('process.env.PAYLOAD_PUBLIC_SERVER_URL');
      expect(config).toContain('interface AuthConfig');
    });

    it('should generate auth config for Payload CMS with single provider', () => {
      const config = TemplateProvider.getAuthConfig(['google'], 'Payload CMS');
      
      expect(config).toContain("providers: ['google']");
      expect(config).toContain("framework: 'Payload CMS'");
      expect(config).toContain('AuthConfig');
    });
  });
});