# ============================================================
# Kiddo PWA - Regenerar iconos desde icono.png
# Ejecutar este script cuando icono.png esté completamente 
# descargado desde OneDrive.
# ============================================================
# Uso: .\regenerate-icons.ps1
# ============================================================

Add-Type -AssemblyName System.Drawing

$srcPath = ".\icono.png"
$outDir = ".\icons"

if (-not (Test-Path $srcPath)) {
    Write-Error "No se encontró icono.png en la raíz del proyecto."
    exit 1
}

$fileSize = (Get-Item $srcPath).Length
if ($fileSize -lt 1000) {
    Write-Error "icono.png parece estar incompleto ($fileSize bytes). Espera a que OneDrive termine de sincronizar."
    exit 1
}

Write-Host "Cargando icono.png ($fileSize bytes)..."

$sizes = @(72, 96, 128, 144, 152, 192, 384, 512)
$original = [System.Drawing.Image]::FromFile((Resolve-Path $srcPath))

Write-Host "Imagen cargada: $($original.Width)x$($original.Height) píxeles"

New-Item -ItemType Directory -Force -Path $outDir | Out-Null

foreach ($size in $sizes) {
    $bitmap = New-Object System.Drawing.Bitmap($size, $size)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $graphics.Clear([System.Drawing.Color]::Transparent)
    $graphics.DrawImage($original, 0, 0, $size, $size)
    
    $outPath = Join-Path $outDir "icon-${size}x${size}.png"
    $bitmap.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $graphics.Dispose()
    $bitmap.Dispose()
    Write-Host "  ✓ icon-${size}x${size}.png"
}

$original.Dispose()
Write-Host ""
Write-Host "¡Listo! Todos los iconos PWA fueron regenerados desde icono.png 🐨"
