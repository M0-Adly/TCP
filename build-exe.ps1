<#
PowerShell script to create native Windows EXEs using jpackage.
Requirements:
 - JDK 16+ (with jpackage available in PATH)
 - Run this script from the project root (where the JARs are built)
Usage:
  1) Run build-jars.bat to build networkserver\networkserver.jar and networkClient\networkclient.jar
  2) Open an elevated PowerShell (if needed) and run: .\build-exe.ps1
#>






















nWrite-Host "Done. EXEs are in: $dist\server and $dist\client"jpackage --name TranslationClient --app-version 1.0 --type exe --input . --main-jar networkClient\networkclient.jar --main-class TranslationClientGUI --dest $dist\client --win-console
nif ($LASTEXITCODE -ne 0) { Write-Error "jpackage failed for client."; exit 1 }
nWrite-Host "Packaging TranslationClient.exe..."jpackage --name TranslationServer --app-version 1.0 --type exe --input . --main-jar networkserver\networkserver.jar --main-class TranslationServerGUI --dest $dist\server --win-console
nif ($LASTEXITCODE -ne 0) { Write-Error "jpackage failed for server."; exit 1 }
nWrite-Host "Packaging TranslationServer.exe..."
n$dist = Join-Path $PSScriptRoot "dist"
nNew-Item -Path $dist -ItemType Directory -Force | Out-Null}    exit 1    Write-Error "networkclient.jar not found. Run build-jars.bat first."}
nif (-not (Test-Path -Path "networkClient\networkclient.jar")) {    exit 1    Write-Error "networkserver.jar not found. Run build-jars.bat first."
nif (-not (Test-Path -Path "networkserver\networkserver.jar")) {Assert-JPackage
nSet-Location -Path $PSScriptRoot}    }        exit 1        Write-Error "jpackage not found in PATH. Install a JDK with jpackage (JDK 16+)."    if (-not (Get-Command jpackage -ErrorAction SilentlyContinue)) {nfunction Assert-JPackage {