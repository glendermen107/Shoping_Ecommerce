#!/usr/bin/env node

/**
 * Script para generar la colección completa de Postman
 * Uso: node generate-postman-collection.js
 */

const fs = require('fs');
const path = require('path');

// Tests comunes
const commonTests = [
    "pm.test('Response time < 500ms', function () {",
    "    pm.expect(pm.response.responseTime).to.be.below(500);",
    "});",
    "",
    "pm.test('Content-Type is JSON', function () {",
    "    pm.response.to.have.header('Content-Type', /json/);",
    "});"
];

// Crear request helper
function createRequest(name, method, path, body = null, requiresAuth = false, tests = [], statusCode = 200) {
    const request = {
        name,
        request: {
            method,
            header: [
                { key: "Content-Type", value: "application/json" }
            ],
            url: {
                raw: `{{base_url}}${path}`,
                host: ["{{base_url}}"],
                path: path.split('/').filter(p => p)
            }
        },
        event: []
    };

    // Agregar auth si es necesario
    if (requiresAuth) {
        request.request.auth = {
            type: "bearer",
            bearer: [{ key: "token", value: "{{access_token}}", type: "string" }]
        };
    }

    // Agregar body si existe
    if (body) {
        request.request.body = {
            mode: "raw",
            raw: JSON.stringify(body, null, 2)
        };
    }

    // Agregar tests
    if (tests.length > 0 || statusCode) {
        const testScript = [
            `pm.test('Status ${statusCode}', function () {`,
            `    pm.response.to.have.status(${statusCode});`,
            `});`,
            "",
            ...commonTests
        ];

        if (tests.length > 0) {
            testScript.push("", ...tests);
        }

        request.event.push({
            listen: "test",
            script: { exec: testScript }
        });
    }

    return request;
}

// Definir colección
const collection = {
    info: {
        _postman_id: "shop-ecommerce-2025",
        name: "Shoping_Ecommerce Backend Tests",
        description: "Colección completa de pruebas automatizadas para el backend NestJS",
        schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
    },
    item: []
};

// 1. AUTH FOLDER
collection.item.push({
    name: "Auth",
    item: [
        createRequest(
            "Register",
            "POST",
            "/auth/register",
            { email: "{{test_email}}", password: "{{test_password}}" },
            false,
            [
                "pm.test('Has user data', function () {",
                "    var json = pm.response.json();",
                "    pm.expect(json).to.have.property('email');",
                "});"
            ],
            201
        ),
        createRequest(
            "Login",
            "POST",
            "/auth/login",
            { email: "{{test_email}}", password: "{{test_password}}" },
            false,
            [
                "pm.test('Has access_token', function () {",
                "    var json = pm.response.json();",
                "    pm.expect(json).to.have.property('access_token');",
                "    pm.environment.set('access_token', json.access_token);",
                "});",
                "",
                "pm.test('Has user data', function () {",
                "    var json = pm.response.json();",
                "    pm.expect(json.user).to.have.property('email');",
                "    pm.expect(json.user).to.have.property('roles');",
                "});"
            ],
            200
        ),
        createRequest(
            "Refresh Token",
            "POST",
            "/auth/refresh",
            null,
            false,
            [
                "pm.test('Has new access_token', function () {",
                "    var json = pm.response.json();",
                "    pm.expect(json).to.have.property('access_token');",
                "    pm.environment.set('access_token', json.access_token);",
                "});"
            ],
            200
        ),
        createRequest(
            "Logout",
            "POST",
            "/auth/logout",
            null,
            true,
            [
                "pm.test('Logout successful', function () {",
                "    var json = pm.response.json();",
                "    pm.expect(json).to.have.property('message');",
                "});"
            ],
            200
        )
    ]
});

// 2. PRODUCTS FOLDER
collection.item.push({
    name: "Products",
    item: [
        createRequest(
            "Get All Products",
            "GET",
            "/products",
            null,
            false,
            [
                "pm.test('Returns array of products', function () {",
                "    var json = pm.response.json();",
                "    pm.expect(json).to.be.an('array');",
                "});",
                "",
                "pm.test('Products have required fields', function () {",
                "    var json = pm.response.json();",
                "    if (json.length > 0) {",
                "        var product = json[0];",
                "        pm.expect(product).to.have.property('id');",
                "        pm.expect(product).to.have.property('name');",
                "        pm.expect(product).to.have.property('price');",
                "        pm.environment.set('product_id', product.id);",
                "    }",
                "});"
            ],
            200
        ),
        createRequest(
            "Get Product by ID",
            "GET",
            "/products/{{product_id}}",
            null,
            false,
            [
                "pm.test('Product has details', function () {",
                "    var json = pm.response.json();",
                "    pm.expect(json).to.have.property('id');",
                "    pm.expect(json).to.have.property('name');",
                "    pm.expect(json).to.have.property('price');",
                "    pm.expect(json).to.have.property('description');",
                "});"
            ],
            200
        ),
        createRequest(
            "Create Product",
            "POST",
            "/products",
            {
                name: "Producto de Prueba",
                description: "Descripción del producto",
                price: 9990,
                stock: 100,
                categoryId: 1
            },
            true,
            [
                "pm.test('Product created', function () {",
                "    var json = pm.response.json();",
                "    pm.expect(json).to.have.property('id');",
                "    pm.environment.set('product_id', json.id);",
                "});"
            ],
            201
        ),
        createRequest(
            "Update Product",
            "PUT",
            "/products/{{product_id}}",
            {
                name: "Producto Actualizado",
                price: 12990
            },
            true,
            [
                "pm.test('Product updated', function () {",
                "    var json = pm.response.json();",
                "    pm.expect(json).to.have.property('id');",
                "});"
            ],
            200
        ),
        createRequest(
            "Delete Product",
            "DELETE",
            "/products/{{product_id}}",
            null,
            true,
            [],
            204
        )
    ]
});

// 3. CART FOLDER
collection.item.push({
    name: "Cart",
    item: [
        createRequest(
            "Add to Cart",
            "POST",
            "/cart",
            {
                productId: 1,
                quantity: 2
            },
            false,
            [
                "pm.test('Item added to cart', function () {",
                "    var json = pm.response.json();",
                "    pm.expect(json).to.have.property('items');",
                "    pm.expect(json.items).to.be.an('array');",
                "});",
                "",
                "pm.test('Cart has totals', function () {",
                "    var json = pm.response.json();",
                "    pm.expect(json).to.have.property('subtotal');",
                "    pm.expect(json).to.have.property('total');",
                "});"
            ],
            200
        ),
        createRequest(
            "Get Cart",
            "GET",
            "/cart",
            null,
            false,
            [
                "pm.test('Cart structure is valid', function () {",
                "    var json = pm.response.json();",
                "    pm.expect(json).to.have.property('items');",
                "    pm.expect(json).to.have.property('subtotal');",
                "    pm.expect(json).to.have.property('total');",
                "});"
            ],
            200
        ),
        createRequest(
            "Remove from Cart",
            "DELETE",
            "/cart/1",
            null,
            false,
            [],
            200
        ),
        createRequest(
            "Clear Cart",
            "DELETE",
            "/cart",
            null,
            false,
            [],
            204
        ),
        createRequest(
            "Get All Carts (Admin)",
            "GET",
            "/cart/admin/all",
            null,
            true,
            [
                "pm.test('Returns array of carts', function () {",
                "    var json = pm.response.json();",
                "    pm.expect(json).to.be.an('array');",
                "});"
            ],
            200
        )
    ]
});

// 4. ORDERS FOLDER
collection.item.push({
    name: "Orders",
    item: [
        createRequest(
            "Checkout (Create Order)",
            "POST",
            "/orders/checkout",
            null,
            true,
            [
                "pm.test('Order created', function () {",
                "    var json = pm.response.json();",
                "    pm.expect(json).to.have.property('id');",
                "    pm.expect(json).to.have.property('total');",
                "    pm.expect(json).to.have.property('status');",
                "    pm.environment.set('order_id', json.id);",
                "});"
            ],
            201
        ),
        createRequest(
            "Get My Orders",
            "GET",
            "/orders/mine",
            null,
            true,
            [
                "pm.test('Returns array of orders', function () {",
                "    var json = pm.response.json();",
                "    pm.expect(json).to.be.an('array');",
                "});",
                "",
                "pm.test('Orders have required fields', function () {",
                "    var json = pm.response.json();",
                "    if (json.length > 0) {",
                "        var order = json[0];",
                "        pm.expect(order).to.have.property('id');",
                "        pm.expect(order).to.have.property('total');",
                "        pm.expect(order).to.have.property('status');",
                "    }",
                "});"
            ],
            200
        ),
        createRequest(
            "Get Order by ID",
            "GET",
            "/orders/{{order_id}}",
            null,
            true,
            [
                "pm.test('Order has details', function () {",
                "    var json = pm.response.json();",
                "    pm.expect(json).to.have.property('id');",
                "    pm.expect(json).to.have.property('items');",
                "    pm.expect(json).to.have.property('total');",
                "});"
            ],
            200
        ),
        createRequest(
            "Complete Order",
            "PATCH",
            "/orders/{{order_id}}/complete",
            null,
            true,
            [
                "pm.test('Order completed', function () {",
                "    var json = pm.response.json();",
                "    pm.expect(json).to.have.property('status');",
                "    pm.expect(json.status).to.equal('COMPLETED');",
                "});"
            ],
            200
        ),
        createRequest(
            "Get All Orders (Admin)",
            "GET",
            "/orders",
            null,
            true,
            [
                "pm.test('Returns array of all orders', function () {",
                "    var json = pm.response.json();",
                "    pm.expect(json).to.be.an('array');",
                "});"
            ],
            200
        )
    ]
});

// Guardar colección
const outputPath = path.join(__dirname, 'Shoping_Ecommerce.postman_collection.json');
fs.writeFileSync(outputPath, JSON.stringify(collection, null, 2));

console.log('✅ Colección generada exitosamente!');
console.log(`📁 Archivo: ${outputPath}`);
console.log('');
console.log('📋 Estadísticas:');
console.log(`   - Carpetas: ${collection.item.length}`);
console.log(`   - Requests totales: ${collection.item.reduce((sum, folder) => sum + folder.item.length, 0)}`);
console.log('');
console.log('🚀 Siguiente paso:');
console.log('   1. Importa la colección en Postman');
console.log('   2. Importa el environment');
console.log('   3. Ejecuta los tests!');
