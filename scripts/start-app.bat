@echo off
TITLE StarWeb Website Analysis Tool
COLOR 0A

ECHO StarWeb - Website Analysis Tool
ECHO ===============================
ECHO.
ECHO Checking prerequisites...
ECHO.

:: Check if Node.js is installed
WHERE node >nul 2>nul
IF %ERRORLEVEL% NEQ 0 (
  ECHO Node.js is not installed. You need to install Node.js to run this application.
  ECHO Visit https://nodejs.org/ to download and install Node.js.
  ECHO.
  ECHO Press any key to open the Node.js download page...
  PAUSE >nul
  start https://nodejs.org/en/download/
  GOTO end
)

:: Check if npm is installed
WHERE npm >nul 2>nul
IF %ERRORLEVEL% NEQ 0 (
  ECHO npm is not installed correctly. You need to install Node.js with npm.
  ECHO Visit https://nodejs.org/ to download and install Node.js.
  ECHO.
  ECHO Press any key to open the Node.js download page...
  PAUSE >nul
  start https://nodejs.org/en/download/
  GOTO end
)

:: Get the directory where the batch file is located
SET AppDir=%~dp0
CD /D %AppDir%\..\

:: Check if package.json exists
IF NOT EXIST package.json (
  ECHO Error: package.json not found. This application may be corrupted.
  ECHO Please reinstall the application.
  ECHO.
  PAUSE
  GOTO end
)

:: Check if node_modules folder exists
IF NOT EXIST node_modules (
  ECHO Installing dependencies (this may take a few minutes)...
  ECHO.
  CALL npm install
)

:: Check if .env file exists
IF NOT EXIST .env (
  ECHO Creating .env file...
  (
    ECHO # OpenAI API Key (required for AI analysis)
    ECHO OPENAI_API_KEY=
    ECHO # Email configuration (required for email sharing)
    ECHO EMAIL_USER=
    ECHO EMAIL_PASS=
    ECHO EMAIL_SERVICE=gmail
  ) > .env
  
  ECHO .env file created. You may need to edit this file with your API keys.
  ECHO.
)

:: Start the application
ECHO Starting StarWeb application...
ECHO.
ECHO If a web browser doesn't open automatically, go to http://localhost:3001
ECHO.
ECHO Press Ctrl+C to stop the application.
ECHO.

:: Start the application
CALL npm run dev

:end
PAUSE 