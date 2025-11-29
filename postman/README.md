# 📮 Colección Postman - Shoping_Ecommerce

## 🎯 Descripción

Esta carpeta contiene la colección de Postman para probar el backend de Shoping_Ecommerce.

---

## 📁 Archivos

1. **`Shoping_Ecommerce.postman_environment.json`** ✅
   - Variables de entorno configuradas
   - Listo para importar

2. **`generate-postman-collection.js`** ✅
   - Script para generar la colección completa
   - Ejecutar con Node.js

3. **`collection-requests.json`** ✅
   - Definiciones de todos los requests
   - Usado por el generador

---

## 🚀 Generar Colección

### Opción 1: Usar Script (Recomendado)

```bash
cd postman
node generate-postman-collection.js
```

Esto generará `Shoping_Ecommerce.postman_collection.json`.

### Opción 2: Importar Manualmente

Si prefieres crear la colección manualmente en Postman:

1. Abre Postman
2. Click en **Import**
3. Selecciona **Raw text**
4. Copia el contenido de `collection-template.json`
5. Click en **Import**

---

## 📚 Documentación Completa

Ver **`docs/postman-tests.md`** para:
- Guía de instalación
- Cómo ejecutar tests
- Interpretar resultados
- Troubleshooting
- Mejores prácticas

---

## ⚡ Inicio Rápido

1. **Generar colección**:
   ```bash
   node generate-postman-collection.js
   ```

2. **Importar en Postman**:
   - Colección: `Shoping_Ecommerce.postman_collection.json`
   - Environment: `Shoping_Ecommerce.postman_environment.json`

3. **Ejecutar tests**:
   - Click derecho en la colección
   - Selecciona **Run collection**
   - Click en **Run**

---

## 🔗 Enlaces

- [Documentación completa](../docs/postman-tests.md)
- [Postman Learning Center](https://learning.postman.com/)

---

**Última actualización**: 2025-01-28
