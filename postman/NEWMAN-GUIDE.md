# 🤖 Guía de Newman - CLI de Postman

## 📋 Descripción

Newman es la herramienta de línea de comandos de Postman que permite ejecutar colecciones desde la terminal o en pipelines de CI/CD.

---

## 🚀 Instalación

### Opción 1: Global (Recomendado)

```bash
npm install -g newman
```

### Opción 2: Local (Proyecto)

```bash
npm install --save-dev newman
```

---

## ▶️ Uso Básico

### Ejecutar Colección

```bash
newman run postman/Shoping_Ecommerce.postman_collection.json
```

### Con Environment

```bash
newman run postman/Shoping_Ecommerce.postman_collection.json \
  -e postman/Shoping_Ecommerce.postman_environment.json
```

### Con Reportes

```bash
newman run postman/Shoping_Ecommerce.postman_collection.json \
  -e postman/Shoping_Ecommerce.postman_environment.json \
  --reporters cli,json,html
```

---

## 📊 Reportes

### CLI (Terminal)

```bash
newman run postman/Shoping_Ecommerce.postman_collection.json \
  --reporters cli
```

Salida:
```
Shoping_Ecommerce Backend Tests

→ Register
  POST http://localhost:3001/auth/register [201 Created, 234ms]
  ✓ Status 201
  ✓ Response time < 500ms
  ✓ Content-Type is JSON

→ Login
  POST http://localhost:3001/auth/login [200 OK, 189ms]
  ✓ Status 200
  ✓ Response time < 500ms
  ✓ Has access_token

...

┌─────────────────────────┬──────────┬──────────┐
│                         │ executed │   failed │
├─────────────────────────┼──────────┼──────────┤
│              iterations │        1 │        0 │
├─────────────────────────┼──────────┼──────────┤
│                requests │       19 │        0 │
├─────────────────────────┼──────────┼──────────┤
│            test-scripts │       19 │        0 │
├─────────────────────────┼──────────┼──────────┤
│      prerequest-scripts │        0 │        0 │
├─────────────────────────┼──────────┼──────────┤
│              assertions │       95 │        0 │
├─────────────────────────┴──────────┴──────────┤
│ total run duration: 3.2s                      │
├───────────────────────────────────────────────┤
│ total data received: 12.34KB (approx)         │
├───────────────────────────────────────────────┤
│ average response time: 167ms                  │
└───────────────────────────────────────────────┘
```

### JSON Report

```bash
newman run postman/Shoping_Ecommerce.postman_collection.json \
  --reporters json \
  --reporter-json-export newman-report.json
```

### HTML Report

```bash
# Instalar reporter HTML
npm install -g newman-reporter-html

# Ejecutar con reporte HTML
newman run postman/Shoping_Ecommerce.postman_collection.json \
  --reporters html \
  --reporter-html-export newman-report.html
```

---

## ⚙️ Opciones Avanzadas

### Timeout

```bash
newman run postman/Shoping_Ecommerce.postman_collection.json \
  --timeout-request 10000
```

### Delay entre Requests

```bash
newman run postman/Shoping_Ecommerce.postman_collection.json \
  --delay-request 100
```

### Iteraciones

```bash
newman run postman/Shoping_Ecommerce.postman_collection.json \
  --iteration-count 5
```

### Carpeta Específica

```bash
newman run postman/Shoping_Ecommerce.postman_collection.json \
  --folder "Auth"
```

### Variables Globales

```bash
newman run postman/Shoping_Ecommerce.postman_collection.json \
  --global-var "base_url=http://localhost:3001"
```

### Ignorar Redirects

```bash
newman run postman/Shoping_Ecommerce.postman_collection.json \
  --ignore-redirects
```

### SSL Inseguro (Desarrollo)

```bash
newman run postman/Shoping_Ecommerce.postman_collection.json \
  --insecure
```

---

## 🔄 Integración CI/CD

### GitHub Actions

```yaml
# .github/workflows/api-tests.yml
name: API Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_USER: dev
          POSTGRES_PASSWORD: devpass
          POSTGRES_DB: ecommerce
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
      
      redis:
        image: redis:7
        ports:
          - 6379:6379
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install Backend Dependencies
        run: |
          cd app/api
          npm install
      
      - name: Start Backend
        run: |
          cd app/api
          npm run start:dev &
          sleep 10
      
      - name: Install Newman
        run: npm install -g newman
      
      - name: Run API Tests
        run: |
          newman run postman/Shoping_Ecommerce.postman_collection.json \
            -e postman/Shoping_Ecommerce.postman_environment.json \
            --reporters cli,json \
            --reporter-json-export newman-report.json
      
      - name: Upload Test Results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: newman-report
          path: newman-report.json
```

### GitLab CI

```yaml
# .gitlab-ci.yml
stages:
  - test

api-tests:
  stage: test
  image: node:18
  services:
    - postgres:16
    - redis:7
  variables:
    POSTGRES_DB: ecommerce
    POSTGRES_USER: dev
    POSTGRES_PASSWORD: devpass
  before_script:
    - cd app/api
    - npm install
    - npm run start:dev &
    - sleep 10
    - cd ../..
    - npm install -g newman
  script:
    - newman run postman/Shoping_Ecommerce.postman_collection.json
        -e postman/Shoping_Ecommerce.postman_environment.json
        --reporters cli,json
        --reporter-json-export newman-report.json
  artifacts:
    when: always
    paths:
      - newman-report.json
    reports:
      junit: newman-report.json
```

### Jenkins

```groovy
// Jenkinsfile
pipeline {
    agent any
    
    stages {
        stage('Setup') {
            steps {
                sh 'npm install -g newman'
            }
        }
        
        stage('Start Services') {
            steps {
                sh 'docker-compose up -d'
                sh 'sleep 10'
            }
        }
        
        stage('Run API Tests') {
            steps {
                sh '''
                    newman run postman/Shoping_Ecommerce.postman_collection.json \
                        -e postman/Shoping_Ecommerce.postman_environment.json \
                        --reporters cli,junit \
                        --reporter-junit-export newman-report.xml
                '''
            }
        }
    }
    
    post {
        always {
            junit 'newman-report.xml'
            sh 'docker-compose down'
        }
    }
}
```

---

## 📝 Scripts NPM

Agregar a `package.json`:

```json
{
  "scripts": {
    "test:api": "newman run postman/Shoping_Ecommerce.postman_collection.json -e postman/Shoping_Ecommerce.postman_environment.json",
    "test:api:report": "newman run postman/Shoping_Ecommerce.postman_collection.json -e postman/Shoping_Ecommerce.postman_environment.json --reporters cli,html --reporter-html-export newman-report.html",
    "test:api:ci": "newman run postman/Shoping_Ecommerce.postman_collection.json -e postman/Shoping_Ecommerce.postman_environment.json --reporters cli,json --reporter-json-export newman-report.json"
  }
}
```

Uso:

```bash
npm run test:api
npm run test:api:report
npm run test:api:ci
```

---

## 🐛 Troubleshooting

### Error: "newman: command not found"

```bash
# Instalar globalmente
npm install -g newman

# O usar npx
npx newman run postman/Shoping_Ecommerce.postman_collection.json
```

### Error: "ECONNREFUSED"

```bash
# Asegúrate de que el backend esté corriendo
cd app/api
npm run start:dev
```

### Error: "Collection not found"

```bash
# Verifica la ruta
ls postman/Shoping_Ecommerce.postman_collection.json

# Usa ruta absoluta si es necesario
newman run $(pwd)/postman/Shoping_Ecommerce.postman_collection.json
```

---

## 📊 Análisis de Resultados

### Exit Codes

- `0` - Todos los tests pasaron
- `1` - Algunos tests fallaron

### Usar en Scripts

```bash
#!/bin/bash

newman run postman/Shoping_Ecommerce.postman_collection.json

if [ $? -eq 0 ]; then
    echo "✅ Todos los tests pasaron"
else
    echo "❌ Algunos tests fallaron"
    exit 1
fi
```

---

## 🎯 Mejores Prácticas

### 1. Usar Variables de Entorno

```bash
# Producción
newman run collection.json -e prod.postman_environment.json

# Staging
newman run collection.json -e staging.postman_environment.json

# Desarrollo
newman run collection.json -e dev.postman_environment.json
```

### 2. Generar Reportes

```bash
newman run collection.json \
  --reporters cli,html,json \
  --reporter-html-export report.html \
  --reporter-json-export report.json
```

### 3. Timeout Apropiado

```bash
newman run collection.json \
  --timeout-request 10000 \
  --timeout-script 5000
```

### 4. Delay entre Requests

```bash
newman run collection.json \
  --delay-request 100
```

---

## 📚 Recursos

- [Newman Documentation](https://learning.postman.com/docs/running-collections/using-newman-cli/command-line-integration-with-newman/)
- [Newman GitHub](https://github.com/postmanlabs/newman)
- [Newman Reporters](https://www.npmjs.com/search?q=newman-reporter)

---

**Última actualización**: 2025-01-28  
**Versión**: 1.0.0
