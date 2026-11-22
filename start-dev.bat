@echo off
title SatyaLens Full-Stack Development
echo ==========================================================
echo   SatyaLens - Real-Time Fact-Verification Engine
echo   NxtWave IDEA FORGE Hackathon
echo ==========================================================
echo.
echo [1/2] Launching FastAPI Backend on http://localhost:8000...
start "SatyaLens Backend API" cmd /k ".\.venv\Scripts\python.exe -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload"
timeout /t 2 /nobreak >nul
echo.
echo [2/2] Launching Vite Frontend on http://localhost:5173...
cd frontend
npm run dev
