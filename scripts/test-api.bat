@echo off
echo ==========================================
echo 🧪 Testing Barbershop API
echo ==========================================

echo.
echo 1. Generating Slots...
curl -X POST "http://localhost:8080/api/slots/generate" -d "barberId=1" -d "start=2026-02-10T09:00:00" -d "end=2026-02-10T17:00:00" -d "duration=30"
echo.

echo.
echo 2. Customer 101 Joining Queue...
curl -X POST "http://localhost:8080/api/queue/join" -d "barberId=1" -d "customerId=101"
echo.

echo.
echo 3. Checking Queue Status...
curl "http://localhost:8080/api/queue?barberId=1"
echo.

echo.
echo 4. Customer 102 Joining Queue...
curl -X POST "http://localhost:8080/api/queue/join" -d "barberId=1" -d "customerId=102"
echo.

echo.
echo 5. Barber Completing Current Customer...
curl -X POST "http://localhost:8080/api/queue/complete" -d "barberId=1"
echo.

echo.
echo 6. Checking Final Queue Status...
curl "http://localhost:8080/api/queue?barberId=1"
echo.

echo.
echo ==========================================
echo ✅ Test Sequence Complete!
echo ==========================================
pause
