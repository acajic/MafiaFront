@ECHO OFF
set FILENAME=mafia_minified.js
copy NUL %FILENAME%
for /R . %%f in (*.js) do (
  echo. >> %FILENAME%
  echo. >> %FILENAME%
  echo // %%~nf >> %FILENAME%
  echo %%~nf
  echo. >> %FILENAME%
  type %%f >> %FILENAME%
)
pause