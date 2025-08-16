import { FrameworkDetector } from '../utils/framework-detector';
import { GitChecker } from '../utils/git-checker';
import { FileGenerator } from '../generators/file-generator';
import { InstructionGenerator } from '../generators/instruction-generator';
import { CLIInterface } from './cli-interface';
import { Framework, Provider } from '../types';

export class AuthKitCLI {
  private framework: Framework = null;
  private selectedProviders: Provider[] = [];
  private projectPath: string = process.cwd();
  private cliInterface: CLIInterface;
  private frameworkDetector: FrameworkDetector;
  private fileGenerator: FileGenerator;

  constructor() {
    this.cliInterface = new CLIInterface();
    this.frameworkDetector = new FrameworkDetector(this.projectPath);
    this.fileGenerator = new FileGenerator(this.projectPath);
  }

  async run(): Promise<void> {
    try {
      this.cliInterface.displayWelcome();
      
      // Check for uncommitted changes
      if (!GitChecker.checkGitStatus()) {
        return;
      }

      // Detect framework
      this.framework = this.frameworkDetector.detectFramework();
      if (!this.framework) {
        this.cliInterface.displayUnsupportedFramework();
        process.exit(1);
      }

      this.cliInterface.displayFramework(this.framework);

      // Select auth providers
      this.selectedProviders = await this.cliInterface.selectAuthProviders();

      // Generate auth files
      await this.fileGenerator.generateAuthFiles(this.framework, this.selectedProviders);

      // Show setup instructions
      InstructionGenerator.showSetupInstructions(this.framework, this.selectedProviders);

    } catch (error) {
      this.cliInterface.displayError(`An error occurred: ${error instanceof Error ? error.message : String(error)}`);
      process.exit(1);
    } finally {
      this.cliInterface.close();
    }
  }
}