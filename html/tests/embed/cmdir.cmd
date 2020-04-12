@echo off&set local
dir
:cmd
cls
dir
set /p "cmd=%dir&&cd%>"
%cmd%
echo.
goto cmd