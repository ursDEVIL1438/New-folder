@echo off
TITLE Smart Campus - Project Runner
CLS

ECHO ======================================================
ECHO    SMART DIGITAL CAMPUS MANAGEMENT SYSTEM
ECHO    Setup and Run Script
ECHO ======================================================
ECHO.

:: Check for Node.js
ECHO [*] Checking for Node.js...
node -v >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    ECHO [X] Node.js is NOT installed!
    ECHO     Please install Node.js from https://nodejs.org/
    PAUSE
    EXIT
)
ECHO [V] Node.js is installed.

:: Check for MongoDB (Optional check, warns if not running)
ECHO [*] Please ensure MongoDB is running on port 27017...
TIMEOUT /T 3

:: Server Setup
ECHO.
ECHO ======================================================
ECHO    SETTING UP BACKEND
ECHO ======================================================
cd server
IF NOT EXIST "node_modules" (
    ECHO [*] Installing Backend Dependencies...
    call npm install
) ELSE (
    ECHO [V] Backend dependencies already installed.
)

:: Create .env if missing
IF NOT EXIST ".env" (
    ECHO [*] Creating default .env file...
    echo MONGO_URI=mongodb://localhost:27017/smartcampus > .env
    echo JWT_SECRET=hackathon_secret_key >> .env
    echo PORT=5000 >> .env
)

:: Start Server in new window
ECHO [*] Starting Backend Server...
start "SmartCampus Backend" cmd /k "npm run dev"
cd ..

:: Client Setup
ECHO.
ECHO ======================================================
ECHO    SETTING UP FRONTEND
ECHO ======================================================
cd client
IF NOT EXIST "node_modules" (
    ECHO [*] Installing Frontend Dependencies...
    call npm install
) ELSE (
    ECHO [V] Frontend dependencies already installed.
)

:: Start Client
ECHO [*] Starting Frontend Application...
echo.
echo    The application will open in your default browser.
echo    Backend: http://localhost:5000
echo    Frontend: http://localhost:3000
echo.
call npm run dev

PAUSE
