import * as fs from 'fs';
import * as path from 'path';
import { FrameworkDetector } from '../src/utils/framework-detector';

// Mock fs module
jest.mock('fs');
const mockedFs = fs as jest.Mocked<typeof fs>;

describe('FrameworkDetector', () => {
  let detector: FrameworkDetector;
  const mockProjectPath = '/mock/project';

  beforeEach(() => {
    detector = new FrameworkDetector(mockProjectPath);
    jest.clearAllMocks();
  });

  describe('detectFramework', () => {
    it('should return null when package.json does not exist', () => {
      mockedFs.existsSync.mockReturnValue(false);

      const result = detector.detectFramework();

      expect(result).toBeNull();
      expect(mockedFs.existsSync).toHaveBeenCalledWith(path.join(mockProjectPath, 'package.json'));
    });

    it('should detect Payload CMS from dependencies', () => {
      mockedFs.existsSync.mockReturnValue(true);
      mockedFs.readFileSync.mockReturnValue(JSON.stringify({
        dependencies: {
          payload: '^1.0.0'
        }
      }));

      const result = detector.detectFramework();

      expect(result).toBe('Payload CMS');
    });

    it('should detect Next.js from dependencies', () => {
      mockedFs.existsSync.mockReturnValue(true);
      mockedFs.readFileSync.mockReturnValue(JSON.stringify({
        dependencies: {
          next: '^13.0.0'
        }
      }));

      const result = detector.detectFramework();

      expect(result).toBe('Next.js');
    });

    it('should detect Next.js from devDependencies', () => {
      mockedFs.existsSync.mockReturnValue(true);
      mockedFs.readFileSync.mockReturnValue(JSON.stringify({
        devDependencies: {
          next: '^13.0.0'
        }
      }));

      const result = detector.detectFramework();

      expect(result).toBe('Next.js');
    });

    it('should prioritize Payload CMS over Next.js when both are present', () => {
      mockedFs.existsSync.mockReturnValue(true);
      mockedFs.readFileSync.mockReturnValue(JSON.stringify({
        dependencies: {
          payload: '^1.0.0',
          next: '^13.0.0'
        }
      }));

      const result = detector.detectFramework();

      expect(result).toBe('Payload CMS');
    });

    it('should detect Next.js from config file when no package.json dependency', () => {
      mockedFs.existsSync
        .mockReturnValueOnce(true) // package.json exists
        .mockReturnValueOnce(true) // next.config.js exists
        .mockReturnValue(false); // other files don't exist
      
      mockedFs.readFileSync.mockReturnValue(JSON.stringify({
        dependencies: {}
      }));

      const result = detector.detectFramework();

      expect(result).toBe('Next.js');
    });

    it('should detect Payload CMS from config file when no package.json dependency', () => {
      mockedFs.existsSync
        .mockReturnValueOnce(true) // package.json exists
        .mockReturnValueOnce(false) // next.config.js doesn't exist
        .mockReturnValueOnce(false) // next.config.mjs doesn't exist
        .mockReturnValueOnce(false) // next.config.ts doesn't exist
        .mockReturnValueOnce(true) // payload.config.js exists
        .mockReturnValue(false); // other files don't exist
      
      mockedFs.readFileSync.mockReturnValue(JSON.stringify({
        dependencies: {}
      }));

      const result = detector.detectFramework();

      expect(result).toBe('Payload CMS');
    });

    it('should return null when no framework is detected', () => {
      mockedFs.existsSync.mockReturnValue(false);
      mockedFs.readFileSync.mockReturnValue(JSON.stringify({
        dependencies: {}
      }));

      const result = detector.detectFramework();

      expect(result).toBeNull();
    });

    it('should handle JSON parse errors gracefully', () => {
      mockedFs.existsSync.mockReturnValue(true);
      mockedFs.readFileSync.mockReturnValue('invalid json');

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      const result = detector.detectFramework();

      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith('⚠️  Error reading package.json');
      
      consoleSpy.mockRestore();
    });
  });
});