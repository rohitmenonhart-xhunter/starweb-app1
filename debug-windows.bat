@echo off
TITLE StarWeb Debug Helper
COLOR 0A

ECHO StarWeb Debug Tool
ECHO =================
ECHO.
ECHO This will collect information to help troubleshoot startup issues
ECHO.

:: Check if Node.js is installed
WHERE node >nul 2>nul
IF %ERRORLEVEL% NEQ 0 (
  ECHO ERROR: Node.js is not installed.
  ECHO Please install Node.js from https://nodejs.org/
  ECHO.
  ECHO Press any key to exit...
  PAUSE >nul
  EXIT /B 1
)

:: Create logs directory if it doesn't exist
IF NOT EXIST logs (
  MKDIR logs
  ECHO Created logs directory
)

:: Get current timestamp for log file
FOR /F "tokens=1-6 delims=/: " %%A IN ('echo %date% %time%') DO (
  SET LOGFILE=logs\starweb-debug-%%A-%%B-%%C-%%D%%E%%F.log
)

ECHO Running diagnostics and saving to %LOGFILE%...
ECHO.

:: Output system info
ECHO System Information: > %LOGFILE%
systeminfo | findstr /C:"OS" >> %LOGFILE%
ECHO. >> %LOGFILE%

:: Output Node.js version
ECHO Node Version: >> %LOGFILE%
node --version >> %LOGFILE%
ECHO. >> %LOGFILE%

:: Check for key files
ECHO Checking for key files: >> %LOGFILE%

IF EXIST server.js (
  ECHO server.js exists >> %LOGFILE%
) ELSE (
  ECHO ERROR: server.js not found >> %LOGFILE%
)

IF EXIST dist (
  ECHO dist directory exists >> %LOGFILE%
  DIR dist /B >> %LOGFILE%
) ELSE (
  ECHO ERROR: dist directory not found >> %LOGFILE%
)

IF EXIST node_modules (
  ECHO node_modules exists >> %LOGFILE%
) ELSE (
  ECHO WARNING: node_modules not found >> %LOGFILE%
)

ECHO. >> %LOGFILE%

:: Try to run the debug script
ECHO Attempting to run debug-app.js... >> %LOGFILE%
ECHO.

ECHO Running debug helper... Please wait.
ECHO (This window will stay open. Check the logs directory for results)
ECHO.

:: Run the debug script and capture output
node debug-app.js 2>> %LOGFILE%

IF %ERRORLEVEL% NEQ 0 (
  ECHO.
  ECHO There was an error running the debug script.
  ECHO.
  ECHO Please send the log file at %LOGFILE% to support.
  ECHO.
  PAUSE
) ELSE (
  ECHO.
  ECHO Debug completed. Check the logs directory for results.
  ECHO.
  PAUSE
) 