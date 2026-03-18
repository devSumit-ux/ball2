@echo off
:: Pharmelo AI Server - Auto Start Script
:: Runs at every Windows login via the Startup folder

cd /d "c:\Users\binay\OneDrive\Desktop\Pharmelo_shop"

:: Start the Node.js backend via PM2
pm2 resurrect
pm2 start ecosystem.config.cjs
pm2 save

:: Start the Cloudflare tunnel in the background (Quick Tunnel with config isolation)
start "" /B ".\cloudflared.exe" tunnel --url http://localhost:3001 --logfile tunnel-quick.log

echo Pharmelo AI Server and Cloudflare Tunnel started!
echo.
echo Waiting for Cloudflare Tunnel URL...
timeout /t 5 >nul
echo.
echo --- YOUR PUBLIC URL IS BELOW ---
powershell -Command "Select-String -Path 'tunnel-quick.log' -Pattern 'trycloudflare.com' | Select-Object -Last 1"
echo ---------------------------------
echo.
pause
