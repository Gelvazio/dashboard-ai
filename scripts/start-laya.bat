@echo off
setlocal
pushd "%~dp0.."
if errorlevel 1 exit /b 1

docker compose -f docker-compose.laya.yml up -d --build laya-serve
set "compose_exit=%ERRORLEVEL%"

popd
exit /b %compose_exit%
