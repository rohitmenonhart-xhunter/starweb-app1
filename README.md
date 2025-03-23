# StarWeb - Website Analysis Tool

StarWeb is a comprehensive website analysis tool that helps identify design issues, exit points, and provides recommendations for improvement.

## Features

- Visual analysis of web pages
- Performance and accessibility assessment
- Content quality evaluation
- SEO recommendations
- Email sharing of analysis reports
- PDF and Word report generation

## Docker Setup (Recommended)

This project is containerized using Docker, making it easy to set up and run in any environment.

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Environment Variables

The application requires environment variables for API keys and email configuration. These are managed through a `.env` file in the root directory.

When you run the `docker-build.sh` script, it will automatically check for a `.env` file and create one if it doesn't exist. You'll then need to edit this file with your actual values:

```
# OpenAI API Key (required for AI analysis)
OPENAI_API_KEY=your_openai_api_key

# Email configuration (required for email sharing)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_SERVICE=gmail
```

**Important Notes:**
- The `.env` file is mounted as a volume in the Docker container, so any changes you make to it will be reflected in the container.
- For Gmail, you need to use an App Password. See [Google's documentation](https://support.google.com/accounts/answer/185833) for more information.
- The `.env` file is excluded from version control for security reasons.

### Quick Start

We provide a convenient script to build and run the Docker container:

```bash
# Make the script executable (if needed)
chmod +x docker-build.sh

# Build and start the container
./docker-build.sh build
```

The script will:
1. Check for a `.env` file and create one if it doesn't exist
2. Prompt you to edit the `.env` file if needed
3. Build and start the Docker container

The application will be available at http://localhost:3001.

### Other Commands

- Start existing container: `./docker-build.sh start`
- Stop container: `./docker-build.sh stop`
- Restart container: `./docker-build.sh restart`
- View logs: `./docker-build.sh logs`
- Clean up Docker resources: `./docker-build.sh clean`
- Show help: `./docker-build.sh help`

### Troubleshooting Docker Issues

If you encounter issues with the Docker setup:

1. Make sure Docker and Docker Compose are installed and running
2. Check if the required ports (3001) are available and not used by other applications
3. Verify that your `.env` file contains valid API keys
4. Check the logs for errors: `./docker-build.sh logs`
5. Try rebuilding the container: `./docker-build.sh build`

## Manual Setup (without Docker)

If you prefer to run the application without Docker:

1. Create a `.env` file in the root directory with the required environment variables (see above)

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

5. Start the production server:
   ```bash
   node server.js
   ```

## Standalone PC Software

StarWeb can be packaged as a standalone desktop application for Windows, macOS, and Linux.

### Quick Start

The easiest way to run StarWeb as a desktop application is to:

1. Download the latest release for your platform from the releases page
2. Run the installer (Windows) or extract the archive (macOS/Linux)
3. Launch the application

### Packaging Your Own Standalone Application

If you want to package the application yourself:

#### Option 1: Simple Scripts (Requires Node.js)

1. Run the appropriate script from the `scripts` directory:
   - Windows: `scripts/start-app.bat`
   - macOS/Linux: `scripts/start-app.sh`

These scripts will automatically:
- Check if Node.js is installed
- Install dependencies if needed
- Create a default .env file if one doesn't exist
- Start the application

#### Option 2: Windows Installer (Requires Node.js)

For Windows users, you can build an installer:

1. Install NSIS from [nsis.sourceforge.net](https://nsis.sourceforge.net/Download)
2. Open NSIS and compile the `scripts/installer.nsi` file
3. Distribute the resulting `StarWeb-Setup.exe` file

#### Option 3: Standalone Executables (No Node.js Required)

You can package the application with Node.js included:

1. Install pkg globally:
   ```bash
   npm install -g pkg
   ```

2. Package the application:
   ```bash
   # For Windows
   npm run package-win
   
   # For macOS
   npm run package-mac
   
   # For Linux
   npm run package-linux
   
   # For all platforms
   npm run package-all
   ```

The packaged executables will be in the `dist` directory.

#### Option 4: Full Desktop Application with Electron

For a more native desktop experience, you could convert this app to use Electron. This would require additional development work but would provide a better desktop experience.

## How It Works

1. Enter a URL in the analysis tool
2. The tool captures a screenshot of the website
3. It analyzes the design, content, and assets using AI
4. It identifies potential exit points where users might leave
5. It highlights design issues that could be improved
6. It provides specific, actionable recommendations

## License

[MIT](LICENSE) 