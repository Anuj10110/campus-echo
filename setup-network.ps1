# Get local IP address
$IP = (ipconfig | Select-String "IPv4 Address" | Select-Object -First 1 | ForEach-Object { $_.Line.Split()[-1] })

if (-not $IP) {
    Write-Host "❌ Could not find local IP address" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Local Network IP: $IP" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Access URLs:" -ForegroundColor Cyan
Write-Host "   Backend:  http://$IP`:5000" -ForegroundColor Yellow
Write-Host "   Frontend: http://$IP`:5174" -ForegroundColor Yellow
Write-Host ""

# Update frontend .env.local
$envPath = "frontend\.env.local"
if (Test-Path $envPath) {
    $content = Get-Content $envPath
    $updatedContent = $content -replace "VITE_API_URL=.*", "VITE_API_URL=http://$IP`:5000/api"
    Set-Content -Path $envPath -Value $updatedContent
    Write-Host "✅ Updated frontend/.env.local" -ForegroundColor Green
    Write-Host "   VITE_API_URL=http://$IP`:5000/api" -ForegroundColor Yellow
} else {
    Write-Host "ℹ️  frontend/.env.local not found" -ForegroundColor Yellow
    Write-Host "   Create it with: VITE_API_URL=http://$IP`:5000/api" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "📋 Instructions:" -ForegroundColor Cyan
Write-Host "   1. Start backend: cd backend && npm run dev" -ForegroundColor Gray
Write-Host "   2. Start frontend: cd frontend && npm run dev" -ForegroundColor Gray
Write-Host "   3. Open browser: http://$IP`:5174" -ForegroundColor Gray
Write-Host ""
Write-Host "💡 Use this IP on other devices to access Campus Echo" -ForegroundColor Green
