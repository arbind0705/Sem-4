@echo off
echo Compiling travelplanner.cpp...
g++ src/backend/c++/travelplanner.cpp -o src/backend/c++/travelplanner.exe
if %ERRORLEVEL% EQU 0 (
    echo Compilation successful!
) else (
    echo Compilation failed!
    exit /b 1
) 