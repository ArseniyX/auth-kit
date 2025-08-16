import * as fs from 'fs';
import * as path from 'path';
import { Framework, PackageJson } from '../types';

export class FrameworkDetector {
  private projectPath: string;

  constructor(projectPath: string = process.cwd()) {
    this.projectPath = projectPath;
  }

  detectFramework(): Framework {
    const packageJsonPath = path.join(this.projectPath, 'package.json');
    
    if (!fs.existsSync(packageJsonPath)) {
      return null;
    }

    try {
      const packageJson: PackageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };

      // Check for Payload CMS
      if (dependencies.payload) {
        return 'Payload CMS';
      }

      // Check for Next.js
      if (dependencies.next) {
        return 'Next.js';
      }

      // Check for Next.js config file
      if (this.hasNextConfigFile()) {
        return 'Next.js';
      }

      // Check for Payload config file
      if (this.hasPayloadConfigFile()) {
        return 'Payload CMS';
      }

    } catch (error) {
      console.log('⚠️  Error reading package.json');
    }

    return null;
  }

  private hasNextConfigFile(): boolean {
    return fs.existsSync(path.join(this.projectPath, 'next.config.js')) || 
           fs.existsSync(path.join(this.projectPath, 'next.config.mjs')) ||
           fs.existsSync(path.join(this.projectPath, 'next.config.ts'));
  }

  private hasPayloadConfigFile(): boolean {
    return fs.existsSync(path.join(this.projectPath, 'payload.config.js')) || 
           fs.existsSync(path.join(this.projectPath, 'payload.config.ts'));
  }
}