#!/usr/bin/env node

/**
 * Secure Package Script
 * 
 * This script handles post-packaging operations to secure the distributed application:
 * 1. Creates a clean distribution folder with only necessary files
 * 2. Removes source code files that shouldn't be distributed
 * 3. Creates platform-specific setup packages
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Define platform (from command line argument)
const platform = process.argv[2] || 'all';

// Define paths
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const secureDistDir = path.join(rootDir, 'secure-dist');

// Create secure distribution directory
if (!fs.existsSync(secureDistDir)) {
  fs.mkdirSync(secureDistDir, { recursive: true });
}

console.log('\n🛡️  Securing packaged application...');

function securePackage(platformName) {
  try {
    console.log(`\n📦 Processing ${platformName} package...`);
    
    // Define executable name based on platform
    let executableName;
    let executableExt = '';
    
    switch(platformName) {
      case 'win':
        executableName = 'starweb-win';
        executableExt = '.exe';
        break;
      case 'mac':
        executableName = 'starweb-mac';
        break;
      case 'linux':
        executableName = 'starweb-linux';
        break;
      default:
        throw new Error(`Unknown platform: ${platformName}`);
    }
    
    const sourceFile = path.join(distDir, executableName + executableExt);
    const targetFile = path.join(secureDistDir, executableName + executableExt);
    
    // Check if the executable exists
    if (!fs.existsSync(sourceFile)) {
      console.log(`❌ Executable not found: ${sourceFile}`);
      console.log(`   Run 'npm run package-${platformName}' first.`);
      return;
    }
    
    // Copy the executable to the secure distribution directory
    fs.copyFileSync(sourceFile, targetFile);
    console.log(`✅ Copied executable to: ${targetFile}`);
    
    // Create a basic readme file with instructions
    const readmeFile = path.join(secureDistDir, `README-${platformName}.txt`);
    
    const readmeContent = `StarWeb - Website Analysis Tool
===========================

This is a proprietary application for website analysis. 

INSTALLATION INSTRUCTIONS:
-------------------------

${platformName === 'win' ? 
`Windows:
1. Double-click the starweb-win.exe file to run the application.
2. If Windows SmartScreen appears, click "More info" and then "Run anyway".
3. The application will open in your default web browser.` : 
platformName === 'mac' ? 
`macOS:
1. Open Terminal and navigate to this folder
2. Run the following command to make the file executable:
   chmod +x starweb-mac
3. Double-click the starweb-mac file or run it from Terminal:
   ./starweb-mac
4. If macOS prevents running the app, go to System Preferences > Security & Privacy 
   and click "Open Anyway".` :
`Linux:
1. Open Terminal and navigate to this folder
2. Run the following command to make the file executable:
   chmod +x starweb-linux
3. Run the application from Terminal:
   ./starweb-linux`}

USAGE:
-----
1. Enter a website URL in the analysis form
2. Click "Analyze" to start the analysis process
3. View and share the analysis results

CONFIGURATION:
-------------
The first time you run the application, you'll be prompted to configure:
- OpenAI API key (for AI analysis)
- Email settings (for sharing reports)

SUPPORT:
-------
For any issues or questions, please contact your system administrator.

Copyright © ${new Date().getFullYear()} - All Rights Reserved
This software is proprietary and confidential.
Unauthorized distribution, modification or use is strictly prohibited.
`;
    
    fs.writeFileSync(readmeFile, readmeContent);
    console.log(`✅ Created readme file: ${readmeFile}`);
    
    // Create platform-specific setup package
    if (platformName === 'win') {
      // Check if 7-Zip is available for Windows packaging
      try {
        execSync('7z --help', { stdio: 'ignore' });
        
        // Create a self-extracting archive
        const sfxConfigFile = path.join(secureDistDir, 'sfx_config.txt');
        fs.writeFileSync(sfxConfigFile, 
          `;!@Install@!UTF-8!
Title="StarWeb Installer"
BeginPrompt="Do you want to install StarWeb?"
RunProgram="starweb-win.exe"
;!@InstallEnd@!`);
        
        const sfxCommand = `7z a -sfx7z.sfx -mmt "${secureDistDir}/StarWeb-Installer.exe" "${targetFile}" "${readmeFile}" -r`;
        console.log(`Executing: ${sfxCommand}`);
        execSync(sfxCommand);
        fs.unlinkSync(sfxConfigFile);
        console.log(`✅ Created self-extracting installer: ${secureDistDir}/StarWeb-Installer.exe`);
      } catch (err) {
        console.log('⚠️  7-Zip not found, skipping self-extracting archive creation.');
        console.log('   To create an installer, you can use NSIS or install 7-Zip.');
      }
    } else if (platformName === 'mac' || platformName === 'linux') {
      // Create a tarball for macOS/Linux
      try {
        const tarCommand = platformName === 'mac' 
          ? `tar -czf "${secureDistDir}/StarWeb-Mac.tar.gz" -C "${secureDistDir}" "${executableName}" "README-${platformName}.txt"`
          : `tar -czf "${secureDistDir}/StarWeb-Linux.tar.gz" -C "${secureDistDir}" "${executableName}" "README-${platformName}.txt"`;
        execSync(tarCommand);
        console.log(`✅ Created compressed archive for ${platformName}`);
      } catch (err) {
        console.log(`⚠️  Failed to create tarball: ${err.message}`);
      }
    }
    
    console.log(`✅ Package for ${platformName} secured successfully.`);
  } catch (error) {
    console.error(`❌ Error securing ${platformName} package:`, error);
  }
}

// Process the requested platform(s)
if (platform === 'all') {
  securePackage('win');
  securePackage('mac');
  securePackage('linux');
} else {
  securePackage(platform);
}

console.log('\n🔒 Packaging process completed.');
console.log(`📁 Secure packages are available in: ${secureDistDir}`);
console.log('\n⚠️  IMPORTANT: Before distributing, test the packaged application to ensure it works correctly.');
console.log('   The source code is not included in the distribution packages.'); 