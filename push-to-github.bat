@echo off
title Golden Blossom Boutique - Push to GitHub
cls
echo ========================================================
echo  Golden Blossom Boutique POS - Direct GitHub Deployer
echo ========================================================
echo.
node "%~dp0push-to-github.js" %*
echo.
pause
