param(
    [string]$InputPath = ".\vietnam.svg",
    [string]$OutputDir = ".\vietnam-split"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Escape-Xml {
    param([string]$Value)

    return [System.Security.SecurityElement]::Escape($Value)
}

function Remove-Diacritics {
    param([string]$Value)

    $Value = $Value.Replace([string][char]0x0110, "D").Replace([string][char]0x0111, "d")
    $normalized = $Value.Normalize([Text.NormalizationForm]::FormD)
    $builder = New-Object System.Text.StringBuilder

    foreach ($char in $normalized.ToCharArray()) {
        if ([Globalization.CharUnicodeInfo]::GetUnicodeCategory($char) -ne [Globalization.UnicodeCategory]::NonSpacingMark) {
            [void]$builder.Append($char)
        }
    }

    return $builder.ToString().Normalize([Text.NormalizationForm]::FormC)
}

function Get-Slug {
    param([string]$Value)

    $ascii = Remove-Diacritics -Value $Value
    $slug = $ascii.ToLowerInvariant() -replace "[^a-z0-9]+", "-"
    $slug = $slug.Trim("-")

    if ([string]::IsNullOrWhiteSpace($slug)) {
        return "item"
    }

    return $slug
}

$inputFullPath = [System.IO.Path]::GetFullPath($InputPath)
$outputFullPath = [System.IO.Path]::GetFullPath($OutputDir)

if (-not [System.IO.File]::Exists($inputFullPath)) {
    throw "Input file not found: $inputFullPath"
}

[System.IO.Directory]::CreateDirectory($outputFullPath) | Out-Null

Get-ChildItem -Path $outputFullPath -File | Where-Object {
    $_.Name -eq "manifest.json" -or $_.Name -like "VN-*.svg"
} | Remove-Item -Force

$utf8 = New-Object System.Text.UTF8Encoding($false)
$svgText = [System.IO.File]::ReadAllText($inputFullPath, [System.Text.Encoding]::UTF8)
[xml]$svgXml = $svgText

$namespaceManager = New-Object System.Xml.XmlNamespaceManager($svgXml.NameTable)
$namespaceManager.AddNamespace("svg", "http://www.w3.org/2000/svg")

$root = $svgXml.DocumentElement
$paths = $svgXml.SelectNodes("/svg:svg/svg:path", $namespaceManager)

if (-not $paths -or $paths.Count -eq 0) {
    throw "No <path> elements found in $inputFullPath"
}

$rootAttributes = @()
foreach ($attribute in $root.Attributes) {
    $rootAttributes += ('   {0}="{1}"' -f $attribute.Name, (Escape-Xml $attribute.Value))
}

$manifest = New-Object System.Collections.Generic.List[object]

foreach ($path in $paths) {
    $provinceId = [string]$path.GetAttribute("id")
    $provinceTitle = [string]$path.GetAttribute("title")

    if ([string]::IsNullOrWhiteSpace($provinceId)) {
        throw "Encountered a path without an id attribute."
    }

    if ([string]::IsNullOrWhiteSpace($provinceTitle)) {
        $provinceTitle = $provinceId
    }

    $fileName = "{0}-{1}.svg" -f $provinceId, (Get-Slug -Value $provinceTitle)
    $outputPath = Join-Path $outputFullPath $fileName

    $pathAttributes = @()
    foreach ($attribute in $path.Attributes) {
        $pathAttributes += ('     {0}="{1}"' -f $attribute.Name, (Escape-Xml $attribute.Value))
    }

    $fileContent = @(
        '<?xml version="1.0" encoding="UTF-8" standalone="no"?>'
        '<!-- Created for MapSVG plugin: http://mapsvg.com -->'
        '<svg'
        $rootAttributes
        '>'
        '  <path'
        $pathAttributes
        ' />'
        '</svg>'
        ''
    ) -join "`n"

    [System.IO.File]::WriteAllText($outputPath, $fileContent, $utf8)

    $manifest.Add([pscustomobject]@{
        id    = $provinceId
        title = $provinceTitle
        file  = $fileName
    }) | Out-Null
}

$manifestPath = Join-Path $outputFullPath "manifest.json"
$manifestJson = $manifest | ConvertTo-Json -Depth 2
[System.IO.File]::WriteAllText($manifestPath, $manifestJson + [Environment]::NewLine, $utf8)

Write-Host ("Split {0} province paths into {1}" -f $paths.Count, $outputFullPath)
Write-Host ("Manifest written to {0}" -f $manifestPath)
