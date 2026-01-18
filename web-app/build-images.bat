@echo off
cd %~dp0

echo Building frontend image...
docker build -t translator-frontend -f frontend/Dockerfile .

echo Building backend image...
docker build -t translator-backend -f backend/Dockerfile .

echo Done.