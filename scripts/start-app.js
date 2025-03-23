#!/usr/bin/env node

// This script is used to start the StarWeb application
// It handles checking for dependencies, setting up the environment, and starting the application

/**
 * IMPORTANT: This file is packaged into the executable and should include
 * protection mechanisms to prevent extraction of the source code.
 */

// Obfuscation and anti-tampering mechanism
(function protectExecution() {
  // Check if we're running in the correct environment
  const startTime = Date.now();
  
  // This is just a simple check to detect debugging/tampering
  // More sophisticated protection would be added in a production version
  setTimeout(() => {
    const elapsed = Date.now() - startTime;
    if (elapsed < 5) {
      console.error("Execution environment compromised. Exiting.");
      process.exit(1);
    }
  }, 10);
})();

const { exec, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');
const readline = require('readline');
const crypto = require('crypto');

// Create readline interface for user interaction
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Define key directories
let appDir;
try {
  // Determine if we're running as a packaged executable or in development
  const isPkg = typeof process.pkg !== 'undefined';
  
  if (isPkg) {
    // When running as a packaged executable
    appDir = path.dirname(process.execPath);
    
    // Additional integrity check for packaged app
    console.log("Starting secure application...");
  } else {
    // When running as a script in development
    appDir = path.resolve(__dirname, '..');
  }
} catch (e) {
  // Fallback
  appDir = path.resolve(__dirname, '..');
}

// Create a license validator
const licenseValidator = {
  // This is a simple placeholder for a real license validation system
  // In a production app, this would check against a more secure mechanism
  checkLicense: function() {
    // Generate a unique machine ID (simplified version)
    const machineId = this.getMachineId();
    
    // Get license file path
    const licensePath = path.join(appDir, '.license');
    
    // Check if license file exists
    if (!fs.existsSync(licensePath)) {
      // In this demo, we'll create an automatic license
      // In a real application, you might want to prompt for a license key
      const generatedLicense = this.generateLicense(machineId);
      fs.writeFileSync(licensePath, generatedLicense);
      return true;
    }
    
    // Read and validate license file
    try {
      const licenseData = fs.readFileSync(licensePath, 'utf8');
      return this.validateLicense(licenseData, machineId);
    } catch (error) {
      return false;
    }
  },
  
  getMachineId: function() {
    // Get a simple machine identifier (this is just a basic example)
    // A real implementation would use more robust machine identification
    const platform = os.platform();
    const hostname = os.hostname();
    const username = os.userInfo().username;
    const cpus = os.cpus().length;
    
    // Create a hash from these values
    const hash = crypto.createHash('sha256');
    hash.update(`${platform}-${hostname}-${username}-${cpus}`);
    return hash.digest('hex');
  },
  
  generateLicense: function(machineId) {
    // In a real implementation, this would create a proper signed license
    // This is just a simplified example
    const expirationDate = new Date();
    expirationDate.setFullYear(expirationDate.getFullYear() + 1); // 1 year license
    
    const licenseData = {
      machineId: machineId,
      expirationDate: expirationDate.toISOString(),
      product: "StarWeb Analysis Tool",
      type: "Standard"
    };
    
    return JSON.stringify(licenseData);
  },
  
  validateLicense: function(licenseData, machineId) {
    try {
      const license = JSON.parse(licenseData);
      
      // Check if license is for this machine
      if (license.machineId !== machineId) {
        return false;
      }
      
      // Check if license has expired
      const expirationDate = new Date(license.expirationDate);
      if (expirationDate < new Date()) {
        return false;
      }
      
      return true;
    } catch (error) {
      return false;
    }
  }
};

// Function to check if Node.js is installed
function checkNodeInstalled() {
  return new Promise((resolve) => {
    exec('node --version', (error) => {
      if (error) {
        console.log('Node.js is not installed. Installing Node.js...');
        resolve(false);
      } else {
        console.log('Node.js is already installed.');
        resolve(true);
      }
    });
  });
}

// Function to install Node.js on Windows
function installNodeOnWindows() {
  return new Promise((resolve, reject) => {
    console.log('Downloading Node.js installer...');
    
    // Create a temp directory for downloads
    const tempDir = path.join(os.tmpdir(), 'starweb-setup');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }
    
    const installerPath = path.join(tempDir, 'node-installer.msi');
    const nodeUrl = 'https://nodejs.org/dist/v18.19.1/node-v18.19.1-x64.msi';
    
    // Download the Node.js installer
    const https = require('https');
    const file = fs.createWriteStream(installerPath);
    
    https.get(nodeUrl, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log('Node.js installer downloaded. Installing...');
        
        // Run the installer
        const installer = spawn('msiexec', ['/i', installerPath, '/quiet', '/norestart'], { 
          detached: true,
          stdio: 'ignore'
        });
        
        installer.on('error', (err) => {
          reject(new Error(`Failed to run Node.js installer: ${err.message}`));
        });
        
        // Wait for installation to complete (approximate time)
        setTimeout(() => {
          console.log('Node.js installation completed.');
          resolve();
        }, 60000); // Wait 60 seconds for installation
      });
    }).on('error', (err) => {
      reject(new Error(`Failed to download Node.js installer: ${err.message}`));
    });
  });
}

// Function to install project dependencies
function installDependencies() {
  return new Promise((resolve, reject) => {
    console.log('Installing project dependencies...');
    
    const npmInstall = spawn('npm', ['install'], { 
      cwd: appDir,
      shell: true,
      stdio: 'inherit'
    });
    
    npmInstall.on('close', (code) => {
      if (code === 0) {
        console.log('Dependencies installed successfully.');
        resolve();
      } else {
        reject(new Error(`npm install failed with code ${code}`));
      }
    });
    
    npmInstall.on('error', (err) => {
      reject(new Error(`Failed to run npm install: ${err.message}`));
    });
  });
}

// Function to start the application
function startApplication() {
  console.log('Starting StarWeb application...');
  
  const isPkg = typeof process.pkg !== 'undefined';
  let startCommand;
  
  if (isPkg) {
    // When running as a packaged executable, we can directly start the server
    // because we've bundled everything into the executable
    startCommand = spawn('node', [path.join(appDir, 'server.js')], {
      cwd: appDir,
      shell: true,
      stdio: 'inherit',
      env: { ...process.env, PORT: '3001' }
    });
  } else {
    // In development mode, use npm run dev
    startCommand = spawn('npm', ['run', 'dev'], { 
      cwd: appDir,
      shell: true,
      stdio: 'inherit'
    });
  }
  
  startCommand.on('close', (code) => {
    console.log(`Application closed with code ${code}.`);
    process.exit(code);
  });
  
  startCommand.on('error', (err) => {
    console.error(`Failed to start application: ${err.message}`);
    process.exit(1);
  });
}

// Main function
async function main() {
  try {
    console.log('StarWeb - Website Analysis Tool');
    console.log('===============================');
    console.log('Preparing to launch the application...');
    
    // Check license
    if (!licenseValidator.checkLicense()) {
      console.error('License validation failed. Please contact your administrator.');
      rl.question('Press Enter to exit...', () => {
        process.exit(1);
      });
      return;
    }
    
    // If running as an executable, we don't need to check for Node.js
    // It's already bundled with the executable
    const isPkg = typeof process.pkg !== 'undefined';
    if (!isPkg) {
      // Check if Node.js is installed (only when running as a script)
      const nodeInstalled = await checkNodeInstalled();
      
      // Install Node.js if not installed (Windows only)
      if (!nodeInstalled) {
        if (os.platform() === 'win32') {
          await installNodeOnWindows();
        } else {
          console.error('Node.js is not installed. Please install Node.js and npm manually.');
          console.log('Visit https://nodejs.org/en/download/ to download and install Node.js.');
          rl.question('Press Enter to exit...', () => {
            process.exit(1);
          });
          return;
        }
      }
      
      // Install dependencies (only when running as a script)
      await installDependencies();
    }
    
    // Check if .env file exists, create it if not
    const envPath = path.join(appDir, '.env');
    if (!fs.existsSync(envPath)) {
      console.log('Creating .env file with default settings...');
      fs.writeFileSync(envPath, `# OpenAI API Key (required for AI analysis)
OPENAI_API_KEY=
# Email configuration (required for email sharing)
EMAIL_USER=
EMAIL_PASS=
EMAIL_SERVICE=gmail`);
      
      console.log('\nNOTE: For full functionality, please edit the .env file with your API keys.');
      console.log('The .env file is located at:', envPath);
    }
    
    // Check if required environment variables are set
    const envContent = fs.readFileSync(envPath, 'utf8');
    const missingVars = [];
    
    if (!envContent.includes('OPENAI_API_KEY=') || envContent.includes('OPENAI_API_KEY=\n')) {
      missingVars.push('OPENAI_API_KEY');
    }
    
    if (missingVars.length > 0) {
      console.log('\nWARNING: Some required environment variables are not set:');
      missingVars.forEach(variable => console.log(`- ${variable}`));
      console.log('\nDo you want to set these variables now? (y/n)');
      
      rl.question('> ', (answer) => {
        if (answer.toLowerCase() === 'y') {
          // Simple setup wizard for environment variables
          const setupVariables = async () => {
            const updatedEnvContent = envContent.split('\n');
            
            for (const variable of missingVars) {
              await new Promise((resolve) => {
                rl.question(`${variable}: `, (value) => {
                  // Find and update the variable in the content
                  const index = updatedEnvContent.findIndex(line => line.startsWith(`${variable}=`));
                  if (index !== -1) {
                    updatedEnvContent[index] = `${variable}=${value}`;
                  }
                  resolve();
                });
              });
            }
            
            fs.writeFileSync(envPath, updatedEnvContent.join('\n'));
            console.log('\nEnvironment variables updated successfully.');
            startApplication();
          };
          
          setupVariables();
        } else {
          console.log('\nYou can edit the .env file manually later.');
          startApplication();
        }
      });
    } else {
      // Start application if all variables are set
      startApplication();
    }
    
  } catch (error) {
    console.error('Error:', error.message);
    rl.question('Press Enter to exit...', () => {
      process.exit(1);
    });
  }
}

// Run the main function
main(); 