@echo off
REM Setup script for cross-device network access
REM This script automatically configures the frontend to work from any device on your network

echo.
echo ========================================
echo Campus Echo - Network Setup
echo ========================================
echo.

REM Get the local IP address
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| find "IPv4"') do (
    set "IP=%%a"
)

REM Clean up the IP (remove leading spaces)
for /f "tokens=*" %%i in ("%IP%") do set "IP=%%i"

if "%IP%"=="" (
    echo [ERROR] Could not detect IP address
    echo Please manually set VITE_API_URL in frontend\.env.local
    echo.
    echo Format: VITE_API_URL=http://YOUR_IP:5000/api
    pause
    exit /b 1
)

echo [INFO] Detected machine IP: %IP%
echo.

REM Create or update .env.local file
set "ENV_FILE=frontend\.env.local"
echo [INFO] Updating %ENV_FILE%...

(
    echo VITE_API_URL=http://%IP%:5000/api
) > "%ENV_FILE%"

if %ERRORLEVEL% EQU 0 (
    echo [SUCCESS] Updated %ENV_FILE%
    echo.
    echo ========================================
    echo Setup Complete!
    echo ========================================
    echo.
    echo Access Campus Echo from any device using:
    echo http://%IP%:5174
    echo.
    echo Make sure:
    echo 1. Backend server is running on port 5000
    echo 2. Frontend dev server is running on port 5174
    echo 3. All devices are on the same network
    echo.
    pause
) else (
    echo [ERROR] Failed to update %ENV_FILE%
    pause
    exit /b 1
)
