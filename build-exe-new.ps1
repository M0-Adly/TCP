<#
PowerShell script to create native Windows EXEs using jpackage. (New/clean script)
Requirements:
 - JDK 16+ (with jpackage available in PATH)
 - Run this script from the project root (where the JARs are built)
Usage:
  1) Run build-jars-fixed.bat to build networkserver\networkserver.jar and networkClient\networkclient.jar
  2) Open an elevated PowerShell (if needed) and run: .\build-exe-new.ps1
#>

function Assert-JPackage {
    if (-not (Get-Command jpackage -ErrorAction SilentlyContinue)) {
        Write-Error "jpackage not found in PATH. Install a JDK with jpackage (JDK 16+)."
        exit 1
    }
}

Set-Location -Path $PSScriptRoot
Assert-JPackage



























nWrite-Host "Notes: - StartAll will try to execute TranslationServer.exe and TranslationClient.exe if present; otherwise it will fallback to running the JARs (requires java in PATH)."
nWrite-Host "Done. EXEs are in: $dist\server, $dist\client and $dist\startall"if ($LASTEXITCODE -ne 0) { Write-Error "jpackage failed for StartAll."; exit 1 }jpackage --name StartAll --app-version 1.0 --type exe --input tools --main-jar startall.jar --main-class launcher.StartAllLauncher --dest $dist\startall --java-options "-Dfile.encoding=UTF-8"# include startall.jar in inputWrite-Host "Packaging StartAll.exe (launcher) ..."
n# Package StartAll launcher (packs startall.jar and will invoke exes/jars)if ($LASTEXITCODE -ne 0) { Write-Error "jpackage failed for client."; exit 1 }jpackage --name TranslationClient --app-version 1.0 --type exe --input networkClient --main-jar networkclient.jar --main-class TranslationClientGUI --dest $dist\client --java-options "-Dfile.encoding=UTF-8"Write-Host "Packaging TranslationClient.exe..."
n# Package client (GUI no console)if ($LASTEXITCODE -ne 0) { Write-Error "jpackage failed for server."; exit 1 }jpackage --name TranslationServer --app-version 1.0 --type exe --input networkserver --main-jar networkserver.jar --main-class TranslationServerGUI --dest $dist\server --java-options "-Dfile.encoding=UTF-8" --win-consoleWrite-Host "Packaging TranslationServer.exe..."
n# Package server (with console)New-Item -Path $dist -ItemType Directory -Force | Out-Null$dist = Join-Path $PSScriptRoot "dist"
n# Create output directoriescmd /c "jar cfe tools/startall.jar launcher.StartAllLauncher -C tools/bin launcher/StartAllLauncher.class"cmd /c "javac -d tools/bin tools/StartAllLauncher.java"# Build StartAll launcher JAR
nWrite-Host "Building StartAll launcher JAR..."}    cmd /c build-jars-fixed.bat    Write-Host "JARs not found. Building JARs first..."n# Ensure jars are built first
nif (-not (Test-Path -Path "networkserver\networkserver.jar") -or -not (Test-Path -Path "networkClient\networkclient.jar")) {