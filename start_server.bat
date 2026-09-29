@echo off
title Akhyana Local Host Server
echo Starting Akhyana Local Server on http://localhost:8081 ...
set "PATH=C:\Users\santh\node22\node-v22.17.0-win-x64;%PATH%"
start http://localhost:8081/aaj-ka-akhyana
npx expo start --web --port 8081
pause
