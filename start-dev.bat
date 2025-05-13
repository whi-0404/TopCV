@echo off
echo Starting development environment...

echo Starting backend server...
start cmd /k "cd . && mvn spring-boot:run"

echo Starting frontend server...
start cmd /k "cd frontend && npm start"

echo Development environment started!
echo Backend: http://localhost:8080
echo Frontend: http://localhost:3000
echo API Test: http://localhost:3000/api-test 