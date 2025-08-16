#!/usr/bin/env node

import { AuthKitCLI } from './cli/auth-kit-cli';

// Run the CLI
const cli = new AuthKitCLI();
cli.run().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});