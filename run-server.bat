@echo off
rem Compile and run TranslationServerGUI
javac -d networkserver/bin networkserver/src/TranslationServerGUI.java
if errorlevel 1 (
  echo Compilation failed. See messages above.
  pause
  goto :eof
)
rem Run server in a new window
start "Translation Server" cmd /k "java -cp networkserver/bin TranslationServerGUI"