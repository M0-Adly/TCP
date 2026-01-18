@echo off
rem Compile and run TranslationClientGUI
javac -d networkClient/bin networkClient/src/TranslationClientGUI.java
if errorlevel 1 (
  echo Compilation failed. See messages above.
  pause
  goto :eof
)
rem Run client in a new window
start "Translation Client" cmd /k "java -cp networkClient/bin TranslationClientGUI"