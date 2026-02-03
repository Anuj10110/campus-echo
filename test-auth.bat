@echo off
REM Cross-Device Authentication Test Script
REM This script tests all aspects of the cross-device authentication system

echo.
echo =====================================
echo Campus Echo - Auth System Test Suite
echo =====================================
echo.

REM Test 1: Check if backend is running
echo [TEST 1] Backend Health Check...
echo Checking if backend is running on port 5000...

powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:5000/api/health' -UseBasicParsing -ErrorAction Stop; if ($response.StatusCode -eq 200) { Write-Host '[PASS] Backend is running' -ForegroundColor Green } else { Write-Host '[FAIL] Backend returned status ' $response.StatusCode -ForegroundColor Red } } catch { Write-Host '[FAIL] Cannot connect to backend' -ForegroundColor Red; Write-Host '  Make sure to run: cd backend && npm run dev' -ForegroundColor Yellow }"

echo.

REM Test 2: Check if frontend is running
echo [TEST 2] Frontend Health Check...
echo Checking if frontend dev server is running on port 5174...

powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:5174' -UseBasicParsing -ErrorAction Stop; if ($response.StatusCode -eq 200) { Write-Host '[PASS] Frontend is running' -ForegroundColor Green } else { Write-Host '[FAIL] Frontend returned status ' $response.StatusCode -ForegroundColor Red } } catch { Write-Host '[FAIL] Cannot connect to frontend' -ForegroundColor Red; Write-Host '  Make sure to run: cd frontend && npm run dev' -ForegroundColor Yellow }"

echo.

REM Test 3: Check .env.local configuration
echo [TEST 3] Frontend Configuration Check...
if exist "frontend\.env.local" (
    echo .env.local file found
    for /f "tokens=*" %%a in (frontend\.env.local) do (
        if "%%a" neq "" (
            echo  - %%a
            if "%%a"=="VITE_API_URL=http://localhost:5000/api" (
                echo [WARNING] Using localhost - won't work from other devices! -ForegroundColor Yellow
            )
        )
    )
) else (
    echo [FAIL] .env.local not found
    echo [INFO] Create it with: VITE_API_URL=http://YOUR_IP:5000/api
)

echo.

REM Test 4: Detect machine IP
echo [TEST 4] Machine IP Detection...
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| find "IPv4"') do (
    set "IP=%%a"
)
for /f "tokens=*" %%i in ("%IP%") do set "IP=%%i"

if "%IP%"=="" (
    echo [FAIL] Could not detect IP address
) else (
    echo [PASS] Machine IP detected: %IP%
    echo [INFO] Use this in .env.local: VITE_API_URL=http://%IP%:5000/api
)

echo.

REM Test 5: Check firewall access
echo [TEST 5] Firewall Port Check...

powershell -Command "try { $result = Test-NetConnection -ComputerName localhost -Port 5000 -InformationLevel Quiet; if ($result) { Write-Host '[PASS] Port 5000 is accessible' -ForegroundColor Green } else { Write-Host '[FAIL] Port 5000 not accessible - check firewall' -ForegroundColor Red } } catch { Write-Host '[FAIL] Cannot test port 5000' -ForegroundColor Red }"

echo.

REM Test 6: Test login endpoint
echo [TEST 6] Auth Endpoint Test...
echo Testing login endpoint with test credentials...

powershell -Command "try { $body = @{email='student@college.edu'; password='password123'} | ConvertTo-Json; $response = Invoke-WebRequest -Uri 'http://localhost:5000/api/auth/login' -Method POST -Body $body -ContentType 'application/json' -UseBasicParsing -ErrorAction Stop; if ($response.StatusCode -eq 200) { Write-Host '[PASS] Login endpoint is working' -ForegroundColor Green } else { Write-Host '[FAIL] Login returned status ' $response.StatusCode -ForegroundColor Red } } catch { Write-Host '[FAIL] Cannot reach login endpoint' -ForegroundColor Red }"

echo.

REM Summary
echo =====================================
echo Test Summary
echo =====================================
echo.
echo [WHAT TO CHECK]
echo 1. Both TEST 1 and TEST 2 should show [PASS]
echo 2. TEST 3 should show your IP address, not localhost
echo 3. TEST 4 should detect your machine IP
echo 4. TEST 5 should show port 5000 is accessible
echo 5. TEST 6 should show login endpoint works
echo.
echo [NEXT STEPS]
echo If all tests pass:
echo  - You're ready to use from other devices!
echo  - Update frontend\.env.local with your IP
echo  - Restart frontend dev server
echo  - Access from other device using: http://%IP%:5174
echo.
echo If tests fail:
echo  - Read the error message carefully
echo  - Check the [INFO] and [WARNING] messages
echo  - Restart servers and try again
echo.
echo [TESTING FROM OTHER DEVICE]
echo Once configured, test from another device:
echo  1. On another device on same WiFi
echo  2. Open browser to: http://%IP%:5174
echo  3. Login with: student@college.edu / password123
echo  4. Should see student dashboard
echo.

pause
