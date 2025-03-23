# StarWeb Packaging Scripts

This directory contains scripts for packaging the StarWeb application into a standalone desktop application for Windows, macOS, and Linux.

## Available Scripts

- `start-app.js` - Node.js script for launching the application
- `start-app.bat` - Windows batch script for launching the application
- `start-app.sh` - Shell script for launching the application on macOS/Linux
- `installer.nsi` - NSIS script for creating a Windows installer

## Building a Windows Installer

To build a Windows installer for the StarWeb application, you'll need to install NSIS (Nullsoft Scriptable Install System).

### Prerequisites

1. Download and install NSIS from [nsis.sourceforge.net](https://nsis.sourceforge.net/Download)
2. Make sure all project files are up to date

### Building the Installer

1. Open NSIS
2. Click "Compile NSI scripts"
3. Select the `installer.nsi` file in this directory
4. The installer will be created as `StarWeb-Setup.exe` in the same directory as the NSI script

### Packaging the Application with Node.js Runtime (Alternative Approach)

If you want to package the application with Node.js included (so users don't need to install Node.js separately), you can use tools like:

1. **Electron** - For creating a full desktop application
2. **pkg** - For packaging Node.js applications into executables
3. **nexe** - For compiling Node.js applications into a single executable

#### Using pkg (Example)

1. Install pkg globally:
   ```
   npm install -g pkg
   ```

2. Add a bin entry to package.json:
   ```json
   "bin": "scripts/start-app.js"
   ```

3. Package the application:
   ```
   pkg . --targets node16-win-x64,node16-macos-x64,node16-linux-x64 --output starweb
   ```

This will create executables for Windows, macOS, and Linux that include the Node.js runtime.

## Using the Application

### Windows

1. Run the installer (`StarWeb-Setup.exe`)
2. The installer will check if Node.js is installed and guide you through the process
3. Launch the application from the Start Menu or Desktop shortcut

### macOS/Linux

1. Make the script executable:
   ```
   chmod +x start-app.sh
   ```

2. Run the script:
   ```
   ./start-app.sh
   ```

## Launcher Scripts Functionality

These scripts perform the following functions:

1. Check if Node.js and npm are installed
2. Install dependencies if needed
3. Create a default .env file if one doesn't exist
4. Start the application with `npm run dev`

## Advanced Packaging

For a more professional and platform-native application, consider using Electron to create a full desktop application with a proper GUI wrapper around your web application. This would allow you to:

1. Package Node.js with your application
2. Create platform-native installers
3. Add features like auto-updates, system tray icons, etc.

To learn more about Electron, visit [electronjs.org](https://www.electronjs.org/). 