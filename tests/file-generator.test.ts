import * as fs from 'fs';
import * as path from 'path';
import { FileGenerator } from '../src/generators/file-generator';

// Mock fs and path modules
jest.mock('fs');
const mockedFs = fs as jest.Mocked<typeof fs>;

describe('FileGenerator', () => {
  let generator: FileGenerator;
  const mockProjectPath = '/mock/project';

  beforeEach(() => {
    generator = new FileGenerator(mockProjectPath);
    jest.clearAllMocks();
  });

  describe('generateAuthFiles', () => {
    it('should generate files for Next.js with Google and GitHub providers', async () => {
      mockedFs.existsSync.mockReturnValue(false);
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      await generator.generateAuthFiles('Next.js', ['google', 'github']);

      const authDir = path.join(mockProjectPath, 'auth');
      
      // Check directory creation
      expect(mockedFs.mkdirSync).toHaveBeenCalledWith(authDir, { recursive: true });
      
      // Check file generation calls
      expect(mockedFs.writeFileSync).toHaveBeenCalledTimes(5); // 2 providers * 2 files + 1 config
      
      // Check specific files
      expect(mockedFs.writeFileSync).toHaveBeenCalledWith(
        path.join(authDir, 'google-callback.ts'),
        expect.stringContaining('// Google OAuth callback for Next.js')
      );
      
      expect(mockedFs.writeFileSync).toHaveBeenCalledWith(
        path.join(authDir, 'google-auth.ts'),
        expect.stringContaining('// Google OAuth initiation for Next.js')
      );
      
      expect(mockedFs.writeFileSync).toHaveBeenCalledWith(
        path.join(authDir, 'github-callback.ts'),
        expect.stringContaining('// GitHub OAuth callback for Next.js')
      );
      
      expect(mockedFs.writeFileSync).toHaveBeenCalledWith(
        path.join(authDir, 'github-auth.ts'),
        expect.stringContaining('// GitHub OAuth initiation for Next.js')
      );
      
      expect(mockedFs.writeFileSync).toHaveBeenCalledWith(
        path.join(authDir, 'auth-config.ts'),
        expect.stringContaining('AuthConfig')
      );

      expect(consoleSpy).toHaveBeenCalledWith('🔧 Generating auth files...\n');
      expect(consoleSpy).toHaveBeenCalledWith('✅ Auth files generated successfully!\n');
      
      consoleSpy.mockRestore();
    });

    it('should generate files for Payload CMS with single provider', async () => {
      mockedFs.existsSync.mockReturnValue(false);
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      await generator.generateAuthFiles('Payload CMS', ['google']);

      const authDir = path.join(mockProjectPath, 'auth');
      
      // Check directory creation
      expect(mockedFs.mkdirSync).toHaveBeenCalledWith(authDir, { recursive: true });
      
      // Check file generation calls (1 provider * 2 files + 1 config = 3 files)
      expect(mockedFs.writeFileSync).toHaveBeenCalledTimes(3);
      
      // Check specific files contain Payload CMS templates
      expect(mockedFs.writeFileSync).toHaveBeenCalledWith(
        path.join(authDir, 'google-callback.ts'),
        expect.stringContaining('// Google OAuth callback for Payload CMS')
      );
      
      expect(mockedFs.writeFileSync).toHaveBeenCalledWith(
        path.join(authDir, 'google-auth.ts'),
        expect.stringContaining('// Google OAuth initiation for Payload CMS')
      );

      consoleSpy.mockRestore();
    });

    it('should not create directory if it already exists', async () => {
      mockedFs.existsSync.mockReturnValue(true);
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      await generator.generateAuthFiles('Next.js', ['google']);

      expect(mockedFs.mkdirSync).not.toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });
  });

  describe('getGeneratedFiles', () => {
    it('should return correct file list for multiple providers', () => {
      const files = generator.getGeneratedFiles(['google', 'github']);
      
      expect(files).toEqual([
        'google-callback.ts',
        'google-auth.ts',
        'github-callback.ts',
        'github-auth.ts',
        'auth-config.ts'
      ]);
    });

    it('should return correct file list for single provider', () => {
      const files = generator.getGeneratedFiles(['google']);
      
      expect(files).toEqual([
        'google-callback.ts',
        'google-auth.ts',
        'auth-config.ts'
      ]);
    });

    it('should return only config file for empty providers array', () => {
      const files = generator.getGeneratedFiles([]);
      
      expect(files).toEqual(['auth-config.ts']);
    });
  });
});