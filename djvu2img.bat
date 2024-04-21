@echo off
REM Author : Ramin Rahimzada
REM Usage  : djvu2jpg "<dvju file path>" "<image file path>"
REM SEE    : https://man.archlinux.org/man/ddjvu.1.en
REM SEE    : https://askubuntu.com/a/480896

if %1=="" goto END1
if %2=="" goto END2


ddjvu -format=tiff -page=1  %1 %2.tiff >nul

ffmpeg -loglevel quiet -hide_banner -i %2.tiff %2 -y >nul

DEL /f /q %2.tiff >nul

goto END

:END1
echo "Input file required."
goto FINALLY

:END2
echo "Output file required."
goto FINALLY

:END
REM echo "done."
goto FINALLY

:FINALLY
