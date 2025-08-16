import { execSync } from 'child_process';

export class GitChecker {
  static checkGitStatus(): boolean {
    try {
      const status = execSync('git status --porcelain', { encoding: 'utf8' });
      
      if (status.trim()) {
        console.log('❌ You have uncommitted changes in your repository.');
        console.log('Please commit your changes before running auth-kit:');
        console.log('  git add .');
        console.log('  git commit -m "your commit message"\n');
        return false;
      }
      return true;
    } catch (error) {
      console.log('⚠️  Could not check git status. Proceeding...\n');
      return true;
    }
  }
}