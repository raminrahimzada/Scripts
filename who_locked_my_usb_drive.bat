@echo off
REM for cmd:
wevtutil qe System /q:"*[System[(EventID=225)]]" /c:5 /f:text /rd:true

REM for powershell:
REM Get-EventLog -LogName System -after (Get-Date).AddHours(-1) | Where-Object {$_.EventID -eq 225} | Sort-Object TimeGenerated | Format-Table -Wrap
