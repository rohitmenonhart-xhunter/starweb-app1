# StarWeb Application Distribution Guide

This document explains how to package and distribute the StarWeb application to staff members in a way that protects the source code while allowing them to use the application.

## Overview

The distribution process creates standalone executables for Windows, macOS, or Linux that:

1. Are completely self-contained (no need to install Node.js)
2. Have protected source code that's not accessible to users
3. Include a basic license verification system
4. Maintain all functionality of the web application
5. Have a simple configuration system for API keys and email settings

## Packaging Process

### Prerequisites

- Node.js and npm installed on your development machine
- `pkg` package installed globally (`npm install -g pkg`)

### Steps to Package the Application

We've created a simple packaging tool that handles the entire process:

```bash
# Make the script executable
chmod +x scripts/package-installer.js

# Run the packaging tool
node scripts/package-installer.js
```

The tool will guide you through the packaging process:

1. Check prerequisites
2. Build the application
3. Ask which platforms to package for (Windows, macOS, Linux, or all)
4. Create secure packages for the selected platforms
5. Place the packages in the `secure-dist` directory

### Output Files

The packaging process creates the following files in the `secure-dist` directory:

- For Windows: `StarWeb-Installer.exe` (self-extracting installer)
- For macOS: `StarWeb-Mac.tar.gz` (compressed archive)
- For Linux: `StarWeb-Linux.tar.gz` (compressed archive)

Each package includes:

- The compiled executable with protected source code
- A README file with installation instructions
- A license file that's automatically generated on first run

## Security Features

The packaged application includes several security features:

1. **Code Protection**: Source code is compiled into a binary format that's not easily extractable
2. **Compression**: All code is compressed to make extraction more difficult
3. **Anti-Tampering**: Basic mechanisms to detect debugging attempts
4. **Machine-Based Licensing**: A simple license mechanism tied to the user's machine
5. **No Source Files**: Raw source code files are not included in the distribution

## How Users Run the Application

### Windows

1. Run the installer (`StarWeb-Installer.exe`) or extract the standalone executable
2. Double-click the `starweb-win.exe` file
3. The application will start and open in their default web browser

### macOS

1. Extract the archive (`StarWeb-Mac.tar.gz`)
2. Make the file executable: `chmod +x starweb-mac`
3. Run the application: `./starweb-mac`

### Linux

1. Extract the archive (`StarWeb-Linux.tar.gz`)
2. Make the file executable: `chmod +x starweb-linux`
3. Run the application: `./starweb-linux`

## First-Run Experience

When users run the application for the first time:

1. A license file is automatically generated for their machine
2. They'll be prompted to set up their environment variables (API keys, etc.)
3. The application will open in their default web browser

## Troubleshooting

If users encounter issues:

- **Permission Errors**: Make sure the executable has proper permissions (especially on macOS/Linux)
- **Blocked by Security**: On Windows, they may need to click "More info" and "Run anyway"
- **API Key Issues**: They need to enter valid API keys when prompted

## Additional Notes

- Users don't need to install Node.js or any other dependencies
- All the complex setup is handled by the executable
- API keys and settings are stored locally in a `.env` file
- Users can update their configuration by editing the `.env` file

## Legal Protection

The distribution package includes a license notice that:

1. Identifies the software as proprietary
2. Prohibits reverse engineering
3. Restricts redistribution
4. Protects your intellectual property

## Conclusion

This distribution method provides a balance between code protection and usability. Users can easily run the application without seeing or accessing the source code, while still having access to all functionality. 