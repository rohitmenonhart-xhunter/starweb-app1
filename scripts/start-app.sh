#!/bin/bash

# Set colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Application title
echo -e "${GREEN}StarWeb - Website Analysis Tool${NC}"
echo -e "${GREEN}===============================${NC}"
echo ""
echo -e "Checking prerequisites..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}Node.js is not installed.${NC} You need to install Node.js to run this application."
    echo "Visit https://nodejs.org/ to download and install Node.js."
    echo ""
    
    # Detect OS for installation instructions
    if [[ "$OSTYPE" == "darwin"* ]]; then
        echo "For macOS, you can install Node.js using Homebrew:"
        echo "  brew install node"
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        echo "For Ubuntu/Debian, you can install Node.js using apt:"
        echo "  sudo apt update"
        echo "  sudo apt install nodejs npm"
        echo ""
        echo "For other Linux distributions, please refer to the Node.js documentation."
    fi
    
    echo ""
    read -p "Press Enter to exit..."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}npm is not installed correctly.${NC} You need to install Node.js with npm."
    echo "Visit https://nodejs.org/ to download and install Node.js."
    echo ""
    read -p "Press Enter to exit..."
    exit 1
fi

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
cd "$SCRIPT_DIR/.."

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo -e "${RED}Error: package.json not found.${NC} This application may be corrupted."
    echo "Please reinstall the application."
    echo ""
    read -p "Press Enter to exit..."
    exit 1
fi

# Check if node_modules folder exists
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing dependencies (this may take a few minutes)...${NC}"
    echo ""
    npm install
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}Creating .env file...${NC}"
    cat > .env << EOL
# OpenAI API Key (required for AI analysis)
OPENAI_API_KEY=

# Email configuration (required for email sharing)
EMAIL_USER=
EMAIL_PASS=
EMAIL_SERVICE=gmail
EOL
    
    echo -e "${YELLOW}.env file created. You may need to edit this file with your API keys.${NC}"
    echo ""
fi

# Start the application
echo -e "${GREEN}Starting StarWeb application...${NC}"
echo ""
echo -e "If a web browser doesn't open automatically, go to ${YELLOW}http://localhost:3001${NC}"
echo ""
echo -e "Press ${YELLOW}Ctrl+C${NC} to stop the application."
echo ""

# Start the application
npm run dev 