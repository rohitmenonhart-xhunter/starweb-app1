# Troubleshooting StarWeb Application

This guide will help you resolve common issues with the StarWeb executable, particularly if it's crashing on startup.

## Windows Executable Crashing on Double-Click

If you double-click the StarWeb executable and it crashes immediately, try the following solutions:

### Solution 1: Run in Console Mode

1. Download the following files from our support team or extract them from the package:
   - `start-console.bat`
   - `debug-windows.bat`

2. Place these files in the same directory as the StarWeb executable.

3. Run `start-console.bat` by double-clicking it. This will:
   - Start StarWeb with a console window visible
   - Show any error messages that occur
   - Keep the window open so you can see the errors

4. If you see any specific error messages, please share them with our support team.

### Solution 2: Run the Debug Tool

1. Run `debug-windows.bat` by double-clicking it.
2. This will collect detailed diagnostic information and save it to a log file.
3. Send the generated log file (found in the `logs` directory) to our support team.

### Solution 3: Run as Administrator

Sometimes Windows security settings can prevent executables from functioning properly:

1. Right-click on the StarWeb executable.
2. Select "Run as administrator" from the context menu.
3. If prompted by User Account Control, click "Yes".

### Solution 4: Check for Missing Files

The executable might be crashing because it can't find essential files:

1. Ensure that you extracted the entire contents of the zip file, not just the executable.
2. Check that the following files and directories exist in the same directory as the executable:
   - `server.js`
   - `dist/` directory
   - `.env` file (this will be created automatically, but may be failing)

### Solution 5: Create a .env File

The application requires a configuration file to run:

1. Create a text file named `.env` in the same directory as the executable.
2. Add the following content to the file:
```
# OpenAI API Key (required for AI analysis)
OPENAI_API_KEY=
# Email configuration (required for email sharing)
EMAIL_USER=
EMAIL_PASS=
EMAIL_SERVICE=gmail
```
3. Try running the application again.

### Solution 6: Check Antivirus Software

Some antivirus software may block the execution of the application:

1. Check your antivirus logs for any blocked activity related to StarWeb.
2. Temporarily disable your antivirus software and try running the application.
3. If it works, add an exception for the StarWeb executable in your antivirus settings.

## Contact Support

If you're still experiencing issues after trying these solutions, please contact our support team and provide:

1. The exact steps you took before the crash occurred
2. Any error messages displayed
3. The log files from the debug tool
4. Your operating system version and any antivirus software you're using

Contact: support@starweb.com 