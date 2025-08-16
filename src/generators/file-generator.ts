import * as fs from 'fs';
import * as path from 'path';
import { TemplateProvider } from '../templates';
import { Framework, Provider } from '../types';

export class FileGenerator {
  private projectPath: string;

  constructor(projectPath: string = process.cwd()) {
    this.projectPath = projectPath;
  }

  async generateAuthFiles(framework: Framework, providers: Provider[]): Promise<void> {
    console.log('🔧 Generating auth files...\n');

    // Create auth directory
    const authDir = path.join(this.projectPath, 'auth');
    this.ensureDirectoryExists(authDir);

    // Generate provider-specific files
    for (const provider of providers) {
      await this.generateProviderFiles(framework, provider, authDir);
    }

    // Generate main auth configuration
    this.generateAuthConfig(framework, providers, authDir);

    console.log('✅ Auth files generated successfully!\n');
  }

  private async generateProviderFiles(framework: Framework, provider: Provider, authDir: string): Promise<void> {
    const fileExtension = 'ts';
    
    // Generate callback file
    const callbackContent = TemplateProvider.getTemplate(framework, provider, 'callback');
    const callbackFileName = `${provider}-callback.${fileExtension}`;
    fs.writeFileSync(path.join(authDir, callbackFileName), callbackContent);

    // Generate route file
    const routeContent = TemplateProvider.getTemplate(framework, provider, 'route');
    const routeFileName = `${provider}-auth.${fileExtension}`;
    fs.writeFileSync(path.join(authDir, routeFileName), routeContent);
  }

  private generateAuthConfig(framework: Framework, providers: Provider[], authDir: string): void {
    const configContent = TemplateProvider.getAuthConfig(providers, framework);
    fs.writeFileSync(path.join(authDir, 'auth-config.ts'), configContent);
  }

  private ensureDirectoryExists(dirPath: string): void {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  getGeneratedFiles(providers: Provider[]): string[] {
    const files: string[] = [];
    
    for (const provider of providers) {
      files.push(`${provider}-callback.ts`);
      files.push(`${provider}-auth.ts`);
    }
    
    files.push('auth-config.ts');
    
    return files;
  }
}