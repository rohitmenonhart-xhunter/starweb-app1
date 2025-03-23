@echo off
TITLE StarWeb Console Mode
COLOR 0A

ECHO StarWeb - Console Mode
ECHO =====================
ECHO.
ECHO Starting StarWeb with console window to view errors...
ECHO.
ECHO If the application crashes, look for error messages above this line.
ECHO Press Ctrl+C to stop the application.
ECHO.

:: Pause briefly to let user read instructions
TIMEOUT /T 2 >NUL

:: Create .env file if it doesn't exist
IF NOT EXIST .env (
  ECHO Creating default .env file...
  (
    ECHO # OpenAI API Key (required for AI analysis)
    ECHO OPENAI_API_KEY=
    ECHO # Email configuration (required for email sharing)
    ECHO EMAIL_USER=
    ECHO EMAIL_PASS=
    ECHO EMAIL_SERVICE=gmail
  ) > .env
  
  ECHO Created .env file.
  ECHO You may need to edit this file with your API keys.
  ECHO.
)

:: Start the server directly with verbose output
ECHO Starting server in console mode...
ECHO.

:: Try to start server directly 
node server.js

:: If we get here, the server stopped
ECHO.
ECHO Server has stopped. See any error messages above.
ECHO.
ECHO Press any key to exit...
PAUSE >NUL 