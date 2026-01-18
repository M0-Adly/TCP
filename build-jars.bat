@echo off
rem Build JARs for server and client (run from project root)
setlocal enabledelayedexpansion

echo Compiling Server...
javac -encoding UTF-8 -d networkserver\bin networkserver\src\TranslationServerGUI.java
if errorlevel 1 (
  echo Server compilation failed.
  pause
  exit /b 1
)

echo Compiling Client...
javac -encoding UTF-8 -d networkClient\bin networkClient\src\TranslationClientGUI.java
if errorlevel 1 (
  echo Client compilation failed.
  pause
  exit /b 1
)

echo Creating manifests...
echo Main-Class: TranslationServerGUI>networkserver\manifest.txt
echo Main-Class: TranslationClientGUI>networkClient\manifest.txt

echo Building server JAR...
jar cfm networkserver\networkserver.jar networkserver\manifest.txt -C networkserver\bin .
if errorlevel 1 (
  echo Failed to create server JAR.
  pause
  exit /b 1
)

echo Building client JAR...
jar cfm networkClient\networkclient.jar networkClient\manifest.txt -C networkClient\bin .
if errorlevel 1 (
  echo Failed to create client JAR.
  pause
  exit /b 1
)

echo Done. Created:
echo  - networkserver\networkserver.jar
echo  - networkClient\networkclient.jar

pause
endlocal
































endlocalpauseecho Done. Created:
necho  - networkserver\networkserver.jar
necho  - networkClient\networkclient.jar)  exit /b 1  pause  echo Failed to create client JAR.if errorlevel 1 (echo Building client JAR...
njar cfm networkClient\networkclient.jar networkClient\manifest.txt -C networkClient\bin .)  exit /b 1  pause  echo Failed to create server JAR.if errorlevel 1 (echo Building server JAR...
njar cfm networkserver\networkserver.jar networkserver\manifest.txt -C networkserver\bin .echo Main-Class: TranslationServerGUI>networkserver\manifest.txt
necho Main-Class: TranslationClientGUI>networkClient\manifest.txtecho Creating manifests...)  exit /b 1  pause  echo Client compilation failed.javac -d networkClient\bin networkClient\src\TranslationClientGUI.java
nif errorlevel 1 (echo Compiling Client...)  exit /b 1  pause  echo Server compilation failed.nif errorlevel 1 (