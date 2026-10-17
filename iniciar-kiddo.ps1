# Servidor local Kiddo - Windows PowerShell 5.1+
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$prefix = 'http://localhost:8765/'
$listener = [System.Net.HttpListener]::new()
$listener.Prefixes.Add($prefix)
$mime = @{
 '.html'='text/html; charset=utf-8'; '.css'='text/css; charset=utf-8'; '.js'='application/javascript; charset=utf-8'; '.json'='application/json; charset=utf-8'; '.png'='image/png'; '.jpg'='image/jpeg'; '.jpeg'='image/jpeg'; '.webp'='image/webp'; '.svg'='image/svg+xml'; '.ico'='image/x-icon'; '.woff'='font/woff'; '.woff2'='font/woff2'; '.mp3'='audio/mpeg'; '.mp4'='video/mp4'; '.glb'='model/gltf-binary'; '.webmanifest'='application/manifest+json'
}
try {
 $listener.Start()
 Write-Host "KIDDO FUNCIONANDO EN: $prefix" -ForegroundColor Green
 Write-Host 'Deja esta ventana abierta. Para detener: Ctrl+C.'
 $rootFull = [System.IO.Path]::GetFullPath($root).TrimEnd('\') + '\'
 while ($listener.IsListening) {
  $ctx = $listener.GetContext()
  try {
   $relative = [Uri]::UnescapeDataString($ctx.Request.Url.AbsolutePath.TrimStart('/'))
   if ([string]::IsNullOrEmpty($relative)) { $relative = 'index.html' }
   $relative = $relative.Replace('/', '\')
   $full = [System.IO.Path]::GetFullPath((Join-Path $root $relative))
   if (-not $full.StartsWith($rootFull,[System.StringComparison]::OrdinalIgnoreCase)) {
    $ctx.Response.StatusCode=403
   } elseif (-not [System.IO.File]::Exists($full)) {
    $ctx.Response.StatusCode=404
   } else {
    $ext=[System.IO.Path]::GetExtension($full).ToLowerInvariant()
    $contentType=$mime[$ext]
    if (-not $contentType) { $contentType='application/octet-stream' }
    $ctx.Response.ContentType=$contentType
    $ctx.Response.Headers.Add('Cache-Control','no-store')
    $bytes=[System.IO.File]::ReadAllBytes($full)
    $ctx.Response.ContentLength64=$bytes.Length
    if ($ctx.Request.HttpMethod -ne 'HEAD') { $ctx.Response.OutputStream.Write($bytes,0,$bytes.Length) }
   }
  } catch {
   Write-Host "Error de solicitud: $($_.Exception.Message)" -ForegroundColor Yellow
   try { $ctx.Response.StatusCode=500 } catch {}
  } finally { try { $ctx.Response.Close() } catch {} }
 }
} catch {
 Write-Host "No se pudo iniciar el servidor: $($_.Exception.Message)" -ForegroundColor Red
} finally { if ($listener.IsListening) { $listener.Stop() }; $listener.Close() }
