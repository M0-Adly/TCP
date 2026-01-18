Packaging instructions — build .jar and native .exe (Windows)

Overview
--------
This project contains a TCP Translation Server and Client (Java Swing). This README explains how to:
- Build runnable JARs for server and client
- Start both apps easily
- Create native Windows EXE installers using `jpackage` (requires JDK 16+)

Quick steps (recommended)
-------------------------
1) From project root, run:
   build-jars.bat
   - This compiles sources and produces:
     - networkserver\networkserver.jar
     - networkClient\networkclient.jar

2) Start both at once (after step 1):
   start-both.bat

Create native Windows EXEs (optional)
------------------------------------
Requirements:
- JDK 16 or later (jpackage must be available in PATH)
- Windows 10/11 recommended

1) Build JARs first (see step 1).
2) Open PowerShell in project root and run:













- Automate the whole pipeline in a single script or CI job.- Create an installer (.msi) using jpackage's installer types.- Add icons to the jpackage commands.If you want, I can:- For the client/server to communicate, ensure the server is started before the client and that port 5000 is allowed by the firewall.- If you prefer a simple EXE wrapper, you can also convert the generated `*.bat` files to EXE using third-party tools like "Bat To Exe Converter" or use Launch4j to create a native exe that wraps the JAR.- If `jpackage` is not found, install a JDK that provides jpackage (e.g., Oracle JDK, AdoptOpenJDK with jpackage) and add it to PATH.-------------------------Notes and troubleshooting
nThis calls `jpackage` and produces EXE packages in `dist\server` and `dist\client`.n   .\build-exe.ps1