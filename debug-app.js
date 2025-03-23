#!/usr/bin/env node

/**
 * Debugging script for StarWeb application
 * This script captures any startup errors and logs them to a file
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a log directory if it doesn't exist
const logDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Create a log file with timestamp
const timestamp = new Date().toISOString().replace(/:/g, '-');
const logFile = path.join(logDir, `starweb-debug-${timestamp}.log`);
const logStream = fs.createWriteStream(logFile, { flags: 'a' });

// Write initial information to the log
logStream.write(`StarWeb Debug Log - ${new Date().toISOString()}\n`);
logStream.write(`Platform: ${process.platform}\n`);
logStream.write(`Node version: ${process.version}\n`);
logStream.write(`Working directory: ${__dirname}\n\n`);

// Check if the .env file exists
const envPath = path.join(__dirname, '.env');
logStream.write(`Checking for .env file at: ${envPath}\n`);
if (fs.existsSync(envPath)) {
  logStream.write(`  .env file exists\n`);
  // Log .env file keys (but not values for security)
  const envContent = fs.readFileSync(envPath, 'utf8');
  const envKeys = envContent
    .split('\n')
    .filter(line => line.trim() && !line.startsWith('#'))
    .map(line => line.split('=')[0]);
  logStream.write(`  Found keys: ${envKeys.join(', ')}\n\n`);
} else {
  logStream.write(`  .env file does not exist, will be created at startup\n\n`);
}

// Check for server.js
const serverPath = path.join(__dirname, 'server.js');
logStream.write(`Checking for server.js at: ${serverPath}\n`);
if (fs.existsSync(serverPath)) {
  logStream.write(`  server.js exists\n\n`);
} else {
  logStream.write(`  ERROR: server.js not found\n\n`);
}

// Check for dist directory (built frontend)
const distPath = path.join(__dirname, 'dist');
logStream.write(`Checking for dist directory at: ${distPath}\n`);
if (fs.existsSync(distPath)) {
  logStream.write(`  dist directory exists\n`);
  const files = fs.readdirSync(distPath);
  logStream.write(`  Contents: ${files.join(', ')}\n\n`);
} else {
  logStream.write(`  ERROR: dist directory not found\n\n`);
}

// Now try to start the application with console outputs redirected to log
logStream.write(`Attempting to start the application...\n`);

try {
  // Try with server.js directly first
  const startApp = spawn('node', [serverPath], {
    cwd: __dirname,
    env: process.env
  });

  startApp.stdout.pipe(logStream, { end: false });
  startApp.stderr.pipe(logStream, { end: false });

  startApp.on('error', (err) => {
    logStream.write(`Failed to start application: ${err.message}\n`);
  });

  startApp.on('close', (code) => {
    logStream.write(`Application closed with code ${code}\n`);
    logStream.end();
  });

  // Display message to user
  console.log('Running StarWeb in debug mode...');
  console.log(`Logs are being written to: ${logFile}`);
  console.log('Press Ctrl+C to stop');
} catch (error) {
  logStream.write(`Critical error: ${error.message}\n`);
  logStream.write(`Stack trace: ${error.stack}\n`);
  logStream.end();
  
  console.error('Critical error starting application. See log file for details.');
  console.error(`Log file: ${logFile}`);
} 