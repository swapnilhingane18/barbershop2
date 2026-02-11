@echo off
cd backend
.\mvnw.cmd spring-boot:run > ..\backend_startup_new.log 2>&1
