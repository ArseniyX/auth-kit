import * as readline from 'readline';
import { Provider } from '../types';

export class CLIInterface {
  private rl: readline.Interface;

  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  async selectAuthProviders(): Promise<Provider[]> {
    const selectedProviders: Provider[] = [];
    
    console.log('Select authentication providers:');
    console.log('1. Google OAuth');
    console.log('2. GitHub OAuth\n');

    const googleAnswer = await this.question('Enable Google OAuth? (y/n): ');
    if (googleAnswer.toLowerCase().startsWith('y')) {
      selectedProviders.push('google');
    }

    const githubAnswer = await this.question('Enable GitHub OAuth? (y/n): ');
    if (githubAnswer.toLowerCase().startsWith('y')) {
      selectedProviders.push('github');
    }

    if (selectedProviders.length === 0) {
      console.log('❌ No providers selected. Exiting...');
      process.exit(1);
    }

    console.log(`\n✅ Selected providers: ${selectedProviders.join(', ')}\n`);
    return selectedProviders;
  }

  private question(query: string): Promise<string> {
    return new Promise((resolve) => {
      this.rl.question(query, resolve);
    });
  }

  close(): void {
    this.rl.close();
  }

  displayWelcome(): void {
    console.log('🔐 Auth Kit - Framework Authentication Setup\n');
  }

  displayFramework(framework: string): void {
    console.log(`✅ Detected framework: ${framework}\n`);
  }

  displayError(message: string): void {
    console.log(`❌ ${message}`);
  }

  displayUnsupportedFramework(): void {
    console.log('❌ Unsupported framework. Currently supported: Next.js, Payload CMS');
  }
}