# Simple service check script
Write-Host "Forum Project Integration Test Check" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Check backend service
Write-Host "1. Checking Backend Service (port:3000)..." -ForegroundColor Blue
$backendRunning = Test-NetConnection -ComputerName localhost -Port 3000 -WarningAction SilentlyContinue | Select-Object -ExpandProperty TcpTestSucceeded
if ($backendRunning) {
    Write-Host "   [OK] Backend service is running" -ForegroundColor Green
} else {
    Write-Host "   [FAIL] Backend service is not running" -ForegroundColor Red
    Write-Host "   Start command: cd backend; npm run dev" -ForegroundColor Gray
}

Write-Host ""

# Check frontend service
Write-Host "2. Checking Frontend Service (port:5173)..." -ForegroundColor Blue
$frontendRunning = Test-NetConnection -ComputerName localhost -Port 5173 -WarningAction SilentlyContinue | Select-Object -ExpandProperty TcpTestSucceeded
if ($frontendRunning) {
    Write-Host "   [OK] Frontend service is running" -ForegroundColor Green
} else {
    Write-Host "   [FAIL] Frontend service is not running" -ForegroundColor Red
    Write-Host "   Start command: cd frontend; npm run dev" -ForegroundColor Gray
}

Write-Host ""

# Check Mock API service
Write-Host "3. Checking Mock API Service (port:3001)..." -ForegroundColor Blue
$mockApiRunning = Test-NetConnection -ComputerName localhost -Port 3001 -WarningAction SilentlyContinue | Select-Object -ExpandProperty TcpTestSucceeded
if ($mockApiRunning) {
    Write-Host "   [OK] Mock API service is running" -ForegroundColor Green
} else {
    Write-Host "   [WARN] Mock API service is not running" -ForegroundColor Yellow
    Write-Host "   Start command: cd mock-api; npm start" -ForegroundColor Gray
}

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "Summary" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

if (-not $backendRunning -and -not $frontendRunning -and -not $mockApiRunning) {
    Write-Host "All services are stopped. Recommended steps:" -ForegroundColor Yellow
    Write-Host "1. First, set up Mock API for testing" -ForegroundColor Gray
    Write-Host "2. Then start frontend to test with Mock API" -ForegroundColor Gray
    Write-Host "3. Finally, develop real backend service" -ForegroundColor Gray
} elseif ($mockApiRunning -and $frontendRunning) {
    Write-Host "Testing environment is READY!" -ForegroundColor Green
    Write-Host "Frontend: http://localhost:5173" -ForegroundColor Gray
    Write-Host "Mock API: http://localhost:3001" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Test account:" -ForegroundColor Gray
    Write-Host "Username: demo_user" -ForegroundColor Gray
    Write-Host "Password: demo123" -ForegroundColor Gray
} else {
    Write-Host "Some services need to be started" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')