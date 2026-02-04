# LCPS AI Assistant - Setup Script for Windows
# Run this script to set up the environment

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "🎓 LCPS AI Assistant - Setup Script" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

# Check Python installation
Write-Host "Checking Python installation..." -ForegroundColor Yellow
$pythonVersion = python --version 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Python is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Python 3.8 or higher from https://www.python.org/" -ForegroundColor Yellow
    exit 1
}
Write-Host "✓ Found: $pythonVersion" -ForegroundColor Green

# Check if virtual environment exists
if (Test-Path "venv") {
    Write-Host ""
    Write-Host "Virtual environment already exists." -ForegroundColor Yellow
    $response = Read-Host "Do you want to recreate it? (y/n)"
    if ($response -eq "y") {
        Write-Host "Removing old virtual environment..." -ForegroundColor Yellow
        Remove-Item -Recurse -Force "venv"
    } else {
        Write-Host "Using existing virtual environment." -ForegroundColor Green
        & "venv\Scripts\Activate.ps1"
        Write-Host "✓ Virtual environment activated" -ForegroundColor Green
        goto InstallDeps
    }
}

# Create virtual environment
Write-Host ""
Write-Host "Creating virtual environment..." -ForegroundColor Yellow
python -m venv venv
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to create virtual environment" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Virtual environment created" -ForegroundColor Green

# Activate virtual environment
Write-Host "Activating virtual environment..." -ForegroundColor Yellow
& "venv\Scripts\Activate.ps1"
Write-Host "✓ Virtual environment activated" -ForegroundColor Green

:InstallDeps
# Upgrade pip
Write-Host ""
Write-Host "Upgrading pip..." -ForegroundColor Yellow
python -m pip install --upgrade pip
Write-Host "✓ pip upgraded" -ForegroundColor Green

# Install dependencies
Write-Host ""
Write-Host "Installing dependencies (this may take several minutes)..." -ForegroundColor Yellow
Write-Host "Note: First run will download AI models (~1-2 GB)" -ForegroundColor Cyan
pip install -r requirements.txt

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    Write-Host "Try running: pip install -r requirements.txt" -ForegroundColor Yellow
    exit 1
}
Write-Host "✓ Dependencies installed" -ForegroundColor Green

# Check for PyAudio issues
Write-Host ""
Write-Host "Checking voice dependencies..." -ForegroundColor Yellow
$pyaudioCheck = python -c "import pyaudio" 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠ PyAudio not properly installed (voice features will be unavailable)" -ForegroundColor Yellow
    Write-Host "To enable voice features, install PyAudio manually:" -ForegroundColor Cyan
    Write-Host "  pip install pipwin" -ForegroundColor Cyan
    Write-Host "  pipwin install pyaudio" -ForegroundColor Cyan
} else {
    Write-Host "✓ Voice dependencies OK" -ForegroundColor Green
}

# Create necessary directories
Write-Host ""
Write-Host "Creating data directories..." -ForegroundColor Yellow
New-Item -ItemType Directory -Force -Path "storage\data" | Out-Null
New-Item -ItemType Directory -Force -Path "storage\data\cache" | Out-Null
New-Item -ItemType Directory -Force -Path "models\cache" | Out-Null
Write-Host "✓ Directories created" -ForegroundColor Green

# Setup complete
Write-Host ""
Write-Host "============================================================" -ForegroundColor Green
Write-Host "✓ Setup Complete!" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. (Optional) Set OPENWEATHER_API_KEY (and optionally HUGGINGFACE_API_TOKEN) in your environment" -ForegroundColor Yellow
Write-Host "2. Run the test suite: python test_assistant.py" -ForegroundColor Yellow
Write-Host "3. Start the assistant: python main.py" -ForegroundColor Yellow
Write-Host ""
Write-Host "For more information, see README.md" -ForegroundColor Cyan
Write-Host ""
