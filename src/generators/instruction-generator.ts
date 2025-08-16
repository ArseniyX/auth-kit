import { Framework, Provider } from '../types';

export class InstructionGenerator {
  static showSetupInstructions(framework: Framework, providers: Provider[]): void {
    console.log('🎉 Setup Complete!\n');
    console.log('📁 Files created:');
    console.log('   /auth/ directory with provider-specific TypeScript files\n');
    
    console.log('🔧 Next steps:\n');
    
    this.showEnvironmentVariables(framework, providers);
    this.showOAuthProviderConfiguration(providers);
    this.showFrameworkIntegration(framework, providers);
    this.showEndpoints(providers);
    this.showCallbackUrls(providers);
    this.showReminders();
    
    console.log('🚀 You\'re ready to implement OAuth authentication!');
  }

  private static showEnvironmentVariables(framework: Framework, providers: Provider[]): void {
    console.log('1. Environment Variables:');
    console.log('   Add these to your .env file:\n');
    
    if (providers.includes('google')) {
      console.log('   # Google OAuth');
      console.log('   GOOGLE_CLIENT_ID=your_google_client_id');
      console.log('   GOOGLE_CLIENT_SECRET=your_google_client_secret\n');
    }
    
    if (providers.includes('github')) {
      console.log('   # GitHub OAuth');
      console.log('   GITHUB_CLIENT_ID=your_github_client_id');
      console.log('   GITHUB_CLIENT_SECRET=your_github_client_secret\n');
    }
    
    if (framework === 'Next.js') {
      console.log('   NEXTAUTH_URL=http://localhost:3000\n');
    } else {
      console.log('   PAYLOAD_PUBLIC_SERVER_URL=http://localhost:3000\n');
    }
  }

  private static showOAuthProviderConfiguration(providers: Provider[]): void {
    console.log('2. OAuth Provider Configuration:\n');
    
    if (providers.includes('google')) {
      console.log('   🔵 Google OAuth Setup:');
      console.log('   - Go to: https://console.developers.google.com/');
      console.log('   - Create a new project or select existing');
      console.log('   - Enable Google+ API');
      console.log('   - Create OAuth 2.0 credentials');
      console.log('   - Add authorized redirect URI:');
      console.log('     http://localhost:3000/auth/google/callback\n');
    }
    
    if (providers.includes('github')) {
      console.log('   ⚫ GitHub OAuth Setup:');
      console.log('   - Go to: https://github.com/settings/developers');
      console.log('   - Click "New OAuth App"');
      console.log('   - Set Authorization callback URL:');
      console.log('     http://localhost:3000/auth/github/callback\n');
    }
  }

  private static showFrameworkIntegration(framework: Framework, providers: Provider[]): void {
    if (framework === 'Next.js') {
      console.log('3. Next.js Integration:');
      console.log('   - Copy the auth files to your app/api/auth/ directory');
      console.log('   - Create route handlers for each provider:');
      if (providers.includes('google')) {
        console.log('     • app/api/auth/google/route.ts');
        console.log('     • app/api/auth/google/callback/route.ts');
      }
      if (providers.includes('github')) {
        console.log('     • app/api/auth/github/route.ts');
        console.log('     • app/api/auth/github/callback/route.ts');
      }
    } else {
      console.log('3. Payload CMS Integration:');
      console.log('   - Add the auth routes to your Payload server configuration');
      console.log('   - Update your collections to handle OAuth users');
    }
  }

  private static showEndpoints(providers: Provider[]): void {
    console.log('\n🌐 Endpoints available:');
    if (providers.includes('google')) {
      console.log('   Google: /auth/google');
    }
    if (providers.includes('github')) {
      console.log('   GitHub: /auth/github');
    }
  }

  private static showCallbackUrls(providers: Provider[]): void {
    console.log('\n🔄 Callback URLs:');
    if (providers.includes('google')) {
      console.log('   Google: /auth/google/callback');
    }
    if (providers.includes('github')) {
      console.log('   GitHub: /auth/github/callback');
    }
  }

  private static showReminders(): void {
    console.log('\n💡 Remember to:');
    console.log('   • Install TypeScript dependencies: @types/node');
    console.log('   • Install required dependencies (if any)');
    console.log('   • Test your OAuth flows in development');
    console.log('   • Update callback URLs for production deployment');
    console.log('   • Implement proper session management');
    console.log('   • Add error handling and user feedback\n');
  }
}