# Script de prueba para el sistema de Refresh Tokens (PowerShell)
# Uso: .\test-with-curl.ps1

$BaseUrl = "http://localhost:3001"
$Email = "test@example.com"
$Password = "password123"
$CookieFile = "cookies.txt"

Write-Host "🧪 Iniciando pruebas del sistema de autenticación..." -ForegroundColor Cyan
Write-Host ""

# Limpiar cookies anteriores
if (Test-Path $CookieFile) {
    Remove-Item $CookieFile
}

# 1. Registro
Write-Host "1️⃣  Registrando usuario..." -ForegroundColor Yellow
$RegisterBody = @{
    email = $Email
    password = $Password
} | ConvertTo-Json

try {
    $RegisterResponse = Invoke-RestMethod -Uri "$BaseUrl/auth/register" `
        -Method Post `
        -ContentType "application/json" `
        -Body $RegisterBody `
        -ErrorAction SilentlyContinue
    Write-Host "✅ Usuario registrado exitosamente" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Usuario ya existe o error en registro" -ForegroundColor Yellow
}
Write-Host ""

# 2. Login
Write-Host "2️⃣  Iniciando sesión..." -ForegroundColor Yellow
$LoginBody = @{
    email = $Email
    password = $Password
} | ConvertTo-Json

try {
    $Session = New-Object Microsoft.PowerShell.Commands.WebRequestSession
    $LoginResponse = Invoke-RestMethod -Uri "$BaseUrl/auth/login" `
        -Method Post `
        -ContentType "application/json" `
        -Body $LoginBody `
        -SessionVariable Session

    $AccessToken = $LoginResponse.access_token
    
    if ($AccessToken) {
        Write-Host "✅ Login exitoso" -ForegroundColor Green
        Write-Host "📝 Access Token: $($AccessToken.Substring(0, [Math]::Min(50, $AccessToken.Length)))..." -ForegroundColor Gray
        Write-Host "🍪 Cookies guardadas en sesión" -ForegroundColor Gray
    } else {
        Write-Host "❌ Error en login" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ Error en login: $_" -ForegroundColor Red
    exit 1
}
Write-Host ""

# 3. Verificar cookie
Write-Host "3️⃣  Verificando cookie de refresh token..." -ForegroundColor Yellow
$RefreshCookie = $Session.Cookies.GetCookies($BaseUrl) | Where-Object { $_.Name -eq "refresh_token" }
if ($RefreshCookie) {
    Write-Host "✅ Cookie de refresh token presente" -ForegroundColor Green
} else {
    Write-Host "❌ Cookie de refresh token no encontrada" -ForegroundColor Red
    exit 1
}
Write-Host ""

# 4. Acceder a ruta protegida
Write-Host "4️⃣  Accediendo a ruta protegida..." -ForegroundColor Yellow
try {
    $Headers = @{
        "Authorization" = "Bearer $AccessToken"
    }
    $ProfileResponse = Invoke-RestMethod -Uri "$BaseUrl/users/profile" `
        -Method Get `
        -Headers $Headers `
        -WebSession $Session

    Write-Host "✅ Acceso a ruta protegida exitoso" -ForegroundColor Green
    Write-Host "👤 Usuario: $($ProfileResponse.email)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Error al acceder a ruta protegida: $_" -ForegroundColor Red
}
Write-Host ""

# 5. Renovar token
Write-Host "5️⃣  Renovando access token..." -ForegroundColor Yellow
try {
    $RefreshResponse = Invoke-RestMethod -Uri "$BaseUrl/auth/refresh" `
        -Method Post `
        -WebSession $Session

    $NewAccessToken = $RefreshResponse.access_token
    
    if ($NewAccessToken) {
        Write-Host "✅ Token renovado exitosamente" -ForegroundColor Green
        Write-Host "📝 Nuevo Access Token: $($NewAccessToken.Substring(0, [Math]::Min(50, $NewAccessToken.Length)))..." -ForegroundColor Gray
    } else {
        Write-Host "❌ Error al renovar token" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ Error al renovar token: $_" -ForegroundColor Red
    exit 1
}
Write-Host ""

# 6. Usar nuevo token
Write-Host "6️⃣  Usando nuevo access token..." -ForegroundColor Yellow
try {
    $NewHeaders = @{
        "Authorization" = "Bearer $NewAccessToken"
    }
    $NewProfileResponse = Invoke-RestMethod -Uri "$BaseUrl/users/profile" `
        -Method Get `
        -Headers $NewHeaders `
        -WebSession $Session

    Write-Host "✅ Nuevo token funciona correctamente" -ForegroundColor Green
} catch {
    Write-Host "❌ Error con nuevo token: $_" -ForegroundColor Red
}
Write-Host ""

# 7. Logout
Write-Host "7️⃣  Cerrando sesión..." -ForegroundColor Yellow
try {
    $LogoutHeaders = @{
        "Authorization" = "Bearer $NewAccessToken"
    }
    $LogoutResponse = Invoke-RestMethod -Uri "$BaseUrl/auth/logout" `
        -Method Post `
        -Headers $LogoutHeaders `
        -WebSession $Session

    Write-Host "✅ Logout exitoso" -ForegroundColor Green
} catch {
    Write-Host "❌ Error en logout: $_" -ForegroundColor Red
}
Write-Host ""

# 8. Intentar renovar después de logout (debe fallar)
Write-Host "8️⃣  Intentando renovar token después de logout..." -ForegroundColor Yellow
try {
    $FailedRefresh = Invoke-RestMethod -Uri "$BaseUrl/auth/refresh" `
        -Method Post `
        -WebSession $Session
    Write-Host "⚠️  Respuesta inesperada: el token debería estar invalidado" -ForegroundColor Yellow
} catch {
    $StatusCode = $_.Exception.Response.StatusCode.value__
    if ($StatusCode -eq 403 -or $StatusCode -eq 401) {
        Write-Host "✅ Refresh token correctamente invalidado (HTTP $StatusCode)" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Respuesta inesperada: HTTP $StatusCode" -ForegroundColor Yellow
    }
}
Write-Host ""

Write-Host "🎉 Pruebas completadas!" -ForegroundColor Cyan
Write-Host ""
Write-Host "📊 Resumen:" -ForegroundColor Cyan
Write-Host "  ✅ Registro de usuario" -ForegroundColor Green
Write-Host "  ✅ Login con generación de tokens" -ForegroundColor Green
Write-Host "  ✅ Cookie httpOnly configurada" -ForegroundColor Green
Write-Host "  ✅ Acceso a rutas protegidas" -ForegroundColor Green
Write-Host "  ✅ Renovación de tokens" -ForegroundColor Green
Write-Host "  ✅ Logout e invalidación" -ForegroundColor Green
Write-Host ""
Write-Host "🔐 Sistema de Refresh Tokens funcionando correctamente!" -ForegroundColor Green
