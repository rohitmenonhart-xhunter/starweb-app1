#!/usr/bin/env node

/**
 * StarWeb Package Installer
 * 
 * This script packages the StarWeb application for distribution to staff.
 * It includes steps to secure the code and create easy-to-use installers.
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create readline interface for user interaction
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Set colors for output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

// Function to print colored text
function print(text, color) {
  console.log(`${color || ''}${text}${colors.reset}`);
}

// Function to execute a command
function executeCommand(command) {
  try {
    print(`Executing: ${command}`, colors.blue);
    execSync(command, { stdio: 'inherit' });
    return true;
  } catch (error) {
    print(`Error executing command: ${command}`, colors.red);
    print(error.message, colors.red);
    return false;
  }
}

// Function to check for prerequisites
function checkPrerequisites() {
  print('\n===== Checking Prerequisites =====', colors.magenta);
  
  // Check if Node.js and npm are installed
  try {
    const nodeVersion = execSync('node --version').toString().trim();
    const npmVersion = execSync('npm --version').toString().trim();
    print(`✅ Node.js version: ${nodeVersion}`, colors.green);
    print(`✅ npm version: ${npmVersion}`, colors.green);
  } catch (error) {
    print('❌ Node.js or npm is not installed', colors.red);
    print('Please install Node.js from https://nodejs.org/', colors.red);
    return false;
  }
  
  // Check if pkg is installed
  try {
    execSync('npm list -g pkg', { stdio: 'ignore' });
    print('✅ pkg is installed globally', colors.green);
  } catch (error) {
    print('⚠️ pkg is not installed globally', colors.yellow);
    print('Installing pkg globally...', colors.yellow);
    
    if (!executeCommand('npm install -g pkg')) {
      print('❌ Failed to install pkg', colors.red);
      return false;
    }
    
    print('✅ pkg installed successfully', colors.green);
  }
  
  return true;
}

// Function to build the application
function buildApplication() {
  print('\n===== Building Application =====', colors.magenta);
  
  // Build the frontend
  if (!executeCommand('npm run build')) {
    print('❌ Failed to build the frontend', colors.red);
    return false;
  }
  
  print('✅ Application built successfully', colors.green);
  return true;
}

// Function to package the application
function packageApplication(platform) {
  print(`\n===== Packaging for ${platform} =====`, colors.magenta);
  
  // Run the appropriate packaging command
  if (!executeCommand(`npm run package-${platform}`)) {
    print(`❌ Failed to package for ${platform}`, colors.red);
    return false;
  }
  
  // Secure the package
  if (!executeCommand(`node scripts/secure-package.cjs ${platform}`)) {
    print(`❌ Failed to secure package for ${platform}`, colors.red);
    return false;
  }
  
  print(`✅ Package for ${platform} created successfully`, colors.green);
  return true;
}

// Main function
async function main() {
  print('\n🌟 StarWeb Packaging Tool 🌟', colors.cyan);
  print('This tool will package the StarWeb application for distribution to staff.', colors.cyan);
  
  // Check prerequisites
  if (!checkPrerequisites()) {
    print('❌ Prerequisites check failed. Please install the required tools and try again.', colors.red);
    rl.close();
    return;
  }
  
  // Build the application
  if (!buildApplication()) {
    print('❌ Application build failed. Please fix the issues and try again.', colors.red);
    rl.close();
    return;
  }
  
  // Ask which platforms to package for
  print('\nWhich platforms would you like to package for?', colors.cyan);
  print('1. Windows', colors.cyan);
  print('2. macOS', colors.cyan);
  print('3. Linux', colors.cyan);
  print('4. All platforms', colors.cyan);
  
  rl.question('Enter your choice (1-4): ', async (choice) => {
    switch (choice) {
      case '1':
        await packageApplication('win');
        break;
      case '2':
        await packageApplication('mac');
        break;
      case '3':
        await packageApplication('linux');
        break;
      case '4':
        await packageApplication('win');
        await packageApplication('mac');
        await packageApplication('linux');
        break;
      default:
        print('❌ Invalid choice. Please run the script again and select a valid option.', colors.red);
        rl.close();
        return;
    }
    
    print('\n🎉 Packaging completed! 🎉', colors.green);
    print('\nDistribution packages are available in the secure-dist directory:', colors.cyan);
    print('- For Windows: StarWeb-Installer.exe', colors.cyan);
    print('- For macOS: StarWeb-Mac.tar.gz', colors.cyan);
    print('- For Linux: StarWeb-Linux.tar.gz', colors.cyan);
    
    print('\n✅ These packages are protected and ready for distribution to staff.', colors.green);
    print('   Code files are secured and not directly accessible.', colors.green);
    print('   Each package contains a README file with installation instructions.', colors.green);
    
    rl.close();
  });
}

// Run the main function
main(); 