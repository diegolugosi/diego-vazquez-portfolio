param(
  [string] $source = "C:\Users\Beliv\OneDrive\Desktop\2097_pop",
  [string] $target = "${PWD}"
)

Write-Output "Source: $source"
Write-Output "Target: $target"

# Images
$imgSource = Join-Path $source 'img'
$imgTarget = Join-Path $target 'img'
if (-Not (Test-Path $imgTarget)) { New-Item -ItemType Directory -Path $imgTarget | Out-Null }
Get-ChildItem -Path $imgSource -File | ForEach-Object {
  Copy-Item -Path $_.FullName -Destination $imgTarget -Force
  Write-Output "Copied image: $($_.Name)"
}

# FontAwesome webfonts
$faSource = Join-Path $source 'fontawesome\webfonts'
$faTarget = Join-Path $target 'fontawesome\webfonts'
if (Test-Path $faSource) {
  if (-Not (Test-Path $faTarget)) { New-Item -ItemType Directory -Path $faTarget | Out-Null }
  Get-ChildItem -Path $faSource -File | ForEach-Object {
    Copy-Item -Path $_.FullName -Destination $faTarget -Force
    Write-Output "Copied font: $($_.Name)"
  }
} else { Write-Output "FontAwesome webfonts source not found: $faSource" }

# Slick fonts
$slickSource = Join-Path $source 'slick\fonts'
$slickTarget = Join-Path $target 'slick\fonts'
if (Test-Path $slickSource) {
  if (-Not (Test-Path $slickTarget)) { New-Item -ItemType Directory -Path $slickTarget | Out-Null }
  Get-ChildItem -Path $slickSource -File | ForEach-Object {
    Copy-Item -Path $_.FullName -Destination $slickTarget -Force
    Write-Output "Copied slick font: $($_.Name)"
  }
} else { Write-Output "Slick fonts source not found: $slickSource" }

Write-Output "Done. Verify files in the repo (img/, fontawesome/webfonts/, slick/fonts/)."