@echo off
:: Pharmelo AI Server - Auto Start Script
:: Runs at every Windows login via the Startup folder

cd /d "c:\Users\binay\OneDrive\Desktop\Pharmelo_shop"

:: Start the Node.js backend via PM2
pm2 resurrect
pm2 start ecosystem.config.cjs
pm2 save

:: Start the Cloudflare tunnel in the background
start "" /B ".\cloudflared.exe" tunnel run pharmelo-ai

echo Pharmelo AI Server and Cloudflare Tunnel started!
