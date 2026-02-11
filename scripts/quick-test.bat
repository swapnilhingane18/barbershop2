@echo off
echo ========================================
echo Barber Shop Application - Quick Test
echo ========================================
echo.

echo Testing Backend Health...
echo.
curl -s http://localhost:8080/actuator/health 2>nul
if %errorlevel% neq 0 (
    echo [FAIL] Backend is not responding on port 8080
    echo Make sure the backend server is running: cd backend ^&^& .\mvnw.cmd spring-boot:run
) else (
    echo [OK] Backend is running
)
echo.

echo Testing Frontend...
echo.
curl -s http://localhost:5173 2>nul | findstr /C:"<!doctype html" >nul
if %errorlevel% neq 0 (
    echo [FAIL] Frontend is not responding on port 5173
    echo Make sure the frontend server is running: cd frontend ^&^& npm run dev
) else (
    echo [OK] Frontend is running
)
echo.

echo ========================================
echo Next Steps:
echo ========================================
echo 1. Open your browser to: http://localhost:5173
echo 2. Follow the testing guide in testing_guide.md
echo 3. Test customer registration and queue flow
echo 4. Test barber dashboard at: http://localhost:5173/dashboard
echo.
echo Press any key to open the application in your browser...
pause >nul
start http://localhost:5173
