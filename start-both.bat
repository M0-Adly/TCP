@echo off
rem Start server and client (using the built JARs)
cd /d "%~dp0"
if not exist networkserver\networkserver.jar (
  echo networkserver.jar not found. Run build-jars.bat first.
  pause
  exit /b 1
)
if not exist networkClient\networkclient.jar (
  echo networkclient.jar not found. Run build-jars.bat first.
  pause
  exit /b 1
)




exit /b 0start "Translation Client" cmd /k "java -jar networkClient\networkclient.jar"timeout /t 1 >nulnstart "Translation Server" cmd /k "java -jar networkserver\networkserver.jar"