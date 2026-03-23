$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path -Parent $PSScriptRoot
$mongoToolsRoot = Join-Path $repoRoot '.tools\mongodb'
$pidFile = Join-Path $mongoToolsRoot 'mongod.pid'
$dataDir = Join-Path $mongoToolsRoot 'data'

$mongoBinary = Get-ChildItem -Path $mongoToolsRoot -Recurse -Filter 'mongod.exe' -ErrorAction SilentlyContinue |
  Sort-Object FullName -Descending |
  Select-Object -First 1

if ($mongoBinary -and (Test-Path $dataDir)) {
  & $mongoBinary.FullName --dbpath $dataDir --shutdown | Out-Null
}

if (Test-Path $pidFile) {
  $existingPid = Get-Content $pidFile -ErrorAction SilentlyContinue
  if ($existingPid) {
    $existingProcess = Get-Process -Id $existingPid -ErrorAction SilentlyContinue
    if ($existingProcess) {
      Stop-Process -Id $existingPid -Force
    }
  }

  Remove-Item $pidFile -Force -ErrorAction SilentlyContinue
}

Write-Output 'MongoDB stopped'
