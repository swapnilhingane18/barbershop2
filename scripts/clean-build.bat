@echo off
echo Cleaning and Building Barbershop Backend...
cd ..\backend
call mvnw.cmd clean compile
echo Build Complete!
pause
