import { execSync } from 'child_process';
import { GitChecker } from '../src/utils/git-checker';

// Mock child_process module
jest.mock('child_process');
const mockedExecSync = execSync as jest.MockedFunction<typeof execSync>;

describe('GitChecker', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('checkGitStatus', () => {
    it('should return true when git status is clean', () => {
      mockedExecSync.mockReturnValue('');
      
      const result = GitChecker.checkGitStatus();
      
      expect(result).toBe(true);
      expect(mockedExecSync).toHaveBeenCalledWith('git status --porcelain', { encoding: 'utf8' });
    });

    it('should return true when git status has only whitespace', () => {
      mockedExecSync.mockReturnValue('   \n  \t  ');
      
      const result = GitChecker.checkGitStatus();
      
      expect(result).toBe(true);
    });

    it('should return false and show message when there are uncommitted changes', () => {
      mockedExecSync.mockReturnValue(' M file.txt\n?? newfile.js');
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      const result = GitChecker.checkGitStatus();
      
      expect(result).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith('❌ You have uncommitted changes in your repository.');
      expect(consoleSpy).toHaveBeenCalledWith('Please commit your changes before running auth-kit:');
      expect(consoleSpy).toHaveBeenCalledWith('  git add .');
      expect(consoleSpy).toHaveBeenCalledWith('  git commit -m "your commit message"\n');
      
      consoleSpy.mockRestore();
    });

    it('should return true and show warning when git command fails', () => {
      mockedExecSync.mockImplementation(() => {
        throw new Error('Git not found');
      });
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      const result = GitChecker.checkGitStatus();
      
      expect(result).toBe(true);
      expect(consoleSpy).toHaveBeenCalledWith('⚠️  Could not check git status. Proceeding...\n');
      
      consoleSpy.mockRestore();
    });

    it('should handle different types of git status outputs', () => {
      const testCases = [
        { output: 'M  modified.txt', expected: false, description: 'modified file' },
        { output: 'A  added.txt', expected: false, description: 'added file' },
        { output: 'D  deleted.txt', expected: false, description: 'deleted file' },
        { output: '?? untracked.txt', expected: false, description: 'untracked file' },
        { output: 'R  renamed.txt -> new.txt', expected: false, description: 'renamed file' },
      ];

      testCases.forEach(({ output, expected, description }) => {
        jest.clearAllMocks();
        mockedExecSync.mockReturnValue(output);
        const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
        
        const result = GitChecker.checkGitStatus();
        
        expect(result).toBe(expected);
        if (!expected) {
          expect(consoleSpy).toHaveBeenCalledWith('❌ You have uncommitted changes in your repository.');
        }
        
        consoleSpy.mockRestore();
      });
    });
  });
});