#!/usr/bin/env node

/**
 * StarWeb Packaging Wrapper
 * 
 * This is a simple wrapper script that runs the package-installer.js script
 * with the correct Node.js flags to handle ES modules correctly.
 */

import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Starting StarWeb packaging process...');

// Run the package-installer.js script
const result = spawnSync('node', ['scripts/package-installer.js'], {
  stdio: 'inherit',
  cwd: __dirname
});

// Check the result
if (result.error) {
  console.error('Error running packaging script:', result.error);
  process.exit(1);
}

process.exit(result.status); 