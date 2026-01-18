@echo off
title Translator App Launcher
color 0A

echo ========================================================
echo   Stopping old processes (Cleaning up ports)...
echo ========================================================
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 >nul

echo.
echo ========================================================
echo   Starting Backend Server (Port 4000)...
echo ========================================================
cd "web-app\backend"
start "Translator Backend" cmd /k "npm run dev"

echo Waiting for backend to wake up...
timeout /t 5 >nul

echo.
echo ========================================================
echo   Starting Frontend Website (Port 3005)...
echo ========================================================
cd "..\frontend"
rem We force port 3005 to ensure we know link to open
start "Translator Frontend" cmd /k "npm run dev -- --port 3005 --strictPort"

echo Waiting for frontend to wake up...
timeout /t 8 >nul

echo.
echo ========================================================
echo   Opening Browser...
echo ========================================================
start http://localhost:3005

echo.
echo ========================================================
echo   SUCCESS! The website should be open now.
echo   If not, manually visit: http://localhost:3005
echo ========================================================
pause
