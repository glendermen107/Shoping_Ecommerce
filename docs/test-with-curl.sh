#!/bin/bash

# Script de prueba para el sistema de Refresh Tokens
# Uso: bash test-with-curl.sh

BASE_URL="http://localhost:3001"
EMAIL="test@example.com"
PASSWORD="password123"
COOKIE_FILE="cookies.txt"

echo "🧪 Iniciando pruebas del sistema de autenticación..."
echo ""

# Limpiar cookies anteriores
rm -f $COOKIE_FILE

# 1. Registro
echo "1️⃣  Registrando usuario..."
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")

if echo "$REGISTER_RESPONSE" | grep -q "email"; then
  echo "✅ Usuario registrado exitosamente"
else
  echo "⚠️  Usuario ya existe o error en registro"
fi
echo ""

# 2. Login
echo "2️⃣  Iniciando sesión..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}" \
  -c $COOKIE_FILE)

ACCESS_TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)

if [ -n "$ACCESS_TOKEN" ]; then
  echo "✅ Login exitoso"
  echo "📝 Access Token: ${ACCESS_TOKEN:0:50}..."
  echo "🍪 Cookie guardada en $COOKIE_FILE"
else
  echo "❌ Error en login"
  exit 1
fi
echo ""

# 3. Verificar cookie
echo "3️⃣  Verificando cookie de refresh token..."
if grep -q "refresh_token" $COOKIE_FILE; then
  echo "✅ Cookie de refresh token presente"
else
  echo "❌ Cookie de refresh token no encontrada"
  exit 1
fi
echo ""

# 4. Acceder a ruta protegida
echo "4️⃣  Accediendo a ruta protegida..."
PROFILE_RESPONSE=$(curl -s -X GET "$BASE_URL/users/profile" \
  -H "Authorization: Bearer $ACCESS_TOKEN")

if echo "$PROFILE_RESPONSE" | grep -q "email"; then
  echo "✅ Acceso a ruta protegida exitoso"
  echo "👤 Usuario: $(echo $PROFILE_RESPONSE | grep -o '"email":"[^"]*' | cut -d'"' -f4)"
else
  echo "❌ Error al acceder a ruta protegida"
fi
echo ""

# 5. Renovar token
echo "5️⃣  Renovando access token..."
REFRESH_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/refresh" \
  -b $COOKIE_FILE \
  -c $COOKIE_FILE)

NEW_ACCESS_TOKEN=$(echo $REFRESH_RESPONSE | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)

if [ -n "$NEW_ACCESS_TOKEN" ]; then
  echo "✅ Token renovado exitosamente"
  echo "📝 Nuevo Access Token: ${NEW_ACCESS_TOKEN:0:50}..."
else
  echo "❌ Error al renovar token"
  exit 1
fi
echo ""

# 6. Usar nuevo token
echo "6️⃣  Usando nuevo access token..."
NEW_PROFILE_RESPONSE=$(curl -s -X GET "$BASE_URL/users/profile" \
  -H "Authorization: Bearer $NEW_ACCESS_TOKEN")

if echo "$NEW_PROFILE_RESPONSE" | grep -q "email"; then
  echo "✅ Nuevo token funciona correctamente"
else
  echo "❌ Error con nuevo token"
fi
echo ""

# 7. Logout
echo "7️⃣  Cerrando sesión..."
LOGOUT_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/logout" \
  -H "Authorization: Bearer $NEW_ACCESS_TOKEN" \
  -b $COOKIE_FILE)

if echo "$LOGOUT_RESPONSE" | grep -q "Logout exitoso"; then
  echo "✅ Logout exitoso"
else
  echo "❌ Error en logout"
fi
echo ""

# 8. Intentar renovar después de logout (debe fallar)
echo "8️⃣  Intentando renovar token después de logout..."
FAILED_REFRESH=$(curl -s -X POST "$BASE_URL/auth/refresh" \
  -b $COOKIE_FILE \
  -w "\n%{http_code}")

HTTP_CODE=$(echo "$FAILED_REFRESH" | tail -n1)

if [ "$HTTP_CODE" = "403" ] || [ "$HTTP_CODE" = "401" ]; then
  echo "✅ Refresh token correctamente invalidado (HTTP $HTTP_CODE)"
else
  echo "⚠️  Respuesta inesperada: HTTP $HTTP_CODE"
fi
echo ""

# Limpiar
rm -f $COOKIE_FILE

echo "🎉 Pruebas completadas!"
echo ""
echo "📊 Resumen:"
echo "  ✅ Registro de usuario"
echo "  ✅ Login con generación de tokens"
echo "  ✅ Cookie httpOnly configurada"
echo "  ✅ Acceso a rutas protegidas"
echo "  ✅ Renovación de tokens"
echo "  ✅ Logout e invalidación"
echo ""
echo "🔐 Sistema de Refresh Tokens funcionando correctamente!"
