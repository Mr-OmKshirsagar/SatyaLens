# SatyaLens Full-Stack Development Launcher
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  SatyaLens — Real-Time Fact-Verification & Deepfake Audit" -ForegroundColor Green
Write-Host "  NxtWave IDEA FORGE Hackathon (Track 1: Civic Pulse)" -ForegroundColor DarkGray
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host ""

$rootPath = Split-Path -Parent $MyInvocation.MyCommand.Definition
Set-Location $rootPath

# 1. Start FastAPI Backend in background
Write-Host "[1/2] Launching FastAPI Backend on http://localhost:8000..." -ForegroundColor Yellow
$backendProc = Start-Process -FilePath "powershell.exe" -ArgumentList "-NoExit", "-Command", "cd '$rootPath'; .\.venv\Scripts\python.exe -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload" -PassThru

# 2. Wait 2 seconds for backend initialization
Start-Sleep -Seconds 2

# 3. Start Vite Frontend
Write-Host "[2/2] Launching Vite Frontend on http://localhost:5173..." -ForegroundColor Green
Set-Location "$rootPath\frontend"
npm run dev
