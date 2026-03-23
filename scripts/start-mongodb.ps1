$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path -Parent $PSScriptRoot
$mongoToolsRoot = Join-Path $repoRoot '.tools\mongodb'
$pidFile = Join-Path $mongoToolsRoot 'mongod.pid'
$dataDir = Join-Path $mongoToolsRoot 'data'
$logDir = Join-Path $mongoToolsRoot 'log'
$logFile = Join-Path $logDir 'mongod.log'

$mongoBinary = Get-ChildItem -Path $mongoToolsRoot -Recurse -Filter 'mongod.exe' -ErrorAction SilentlyContinue |
  Sort-Object FullName -Descending |
  Select-Object -First 1

if (-not $mongoBinary) {
  throw 'mongod.exe was not found under .tools\mongodb. Install or extract MongoDB first.'
}

New-Item -ItemType Directory -Force -Path $dataDir | Out-Null
New-Item -ItemType Directory -Force -Path $logDir | Out-Null

if (Test-Path $pidFile) {
  $existingPid = Get-Content $pidFile -ErrorAction SilentlyContinue
  if ($existingPid) {
    $existingProcess = Get-Process -Id $existingPid -ErrorAction SilentlyContinue
    if ($existingProcess) {
      Write-Output "MongoDB is already running with PID $existingPid"
      exit 0
    }
  }
}

$process = Start-Process `
  -FilePath $mongoBinary.FullName `
  -ArgumentList @(
    '--dbpath', $dataDir,
    '--bind_ip', '127.0.0.1',
    '--port', '27017',
    '--logpath', $logFile,
    '--logappend'
  ) `
  -PassThru `
  -WindowStyle Hidden

Set-Content -Path $pidFile -Value $process.Id
Start-Sleep -Seconds 3

if (Get-Process -Id $process.Id -ErrorAction SilentlyContinue) {
  Write-Output "MongoDB started with PID $($process.Id)"
  Write-Output "Binary: $($mongoBinary.FullName)"
  Write-Output "DB path: $dataDir"
  exit 0
}

throw "MongoDB failed to stay running. Check $logFile"
