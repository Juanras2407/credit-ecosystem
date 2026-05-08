# Credit Ecosystem

Evaluación de créditos compuesto por un frontend React, un microservicio orquestador (A) y un microservicio de riesgos mock (B), todo el backend en Java 17 + Quarkus 3.9.3.

## Arquitectura
```
Frontend (React)
    └── REST ──► Microservicio A (Orquestador) :8080
                        └── gRPC ──► Microservicio B (Riesgos) :9000
                        └── PostgreSQL :5432
```

| Componente       | Tecnología              | Puerto |
|------------------|-------------------------|--------|
| Frontend         | React + Vite            | 3000   |
| Microservicio A  | Quarkus                 | 8080   |
| Microservicio B  | Quarkus (gRPC)          | 9000   |
| Base de datos    | PostgreSQL 15           | 5433   |

---

## Opción 1 — Docker Compose

### Requisitos
- Docker 24+
- Docker Compose v2

### Pasos

```bash
git clone <repo-url>
cd credit-ecosystem
docker compose up --build
```

Una vez que todos los contenedores estén arriba, abrir: [http://localhost:3000]

Detener:

```bash
docker compose down
```

Detener y eliminar volumen de la db:

```bash
docker compose down -v
```

---

## Opción 2 — Ejecución local

### Requisitos
- Java 17+
- Maven 3.9+
- Node.js 20+
- PostgreSQL 15 corriendo en `localhost:5432`

### 1. Base de datos

Crear la base de datos y el usuario:

```sql
CREATE DATABASE creditodb;
CREATE USER credito WITH PASSWORD 'credito123';
GRANT ALL PRIVILEGES ON DATABASE creditodb TO credito;
```

Aplicar el schema inicial:

```bash
psql -U credito -d creditodb -f init.sql
```

### 2. Microservicio B — Riesgos (gRPC)

```bash
cd microservice-b
./mvnw quarkus:dev
```

Queda escuchando en:
- gRPC: `localhost:9000`
- HTTP (health/metrics): `localhost:8081`

### 3. Microservicio A — Orquestador (REST)

En otra terminal:

```bash
cd microservice-a
./mvnw quarkus:dev
```

Queda escuchando en: `localhost:8080`

### 4. Frontend

En otra terminal:

```bash
cd frontend
npm install
npm run dev
```

Abrir: [http://localhost:5173]

---

## Variables de entorno (Microservicio A)

| Variable            | Default       | Descripción               |
|---------------------|---------------|---------------------------|
| `DB_HOST`           | `localhost`   | Host de PostgreSQL        |
| `DB_PORT`           | `5432`        | Puerto de PostgreSQL      |
| `DB_NAME`           | `creditodb`   | Nombre de la base         |
| `DB_USER`           | `credito`     | Usuario                   |
| `DB_PASSWORD`       | `credito123`  | Contraseña                |
| `RISK_SERVICE_HOST` | `localhost`   | Host del Microservicio B  |
| `RISK_SERVICE_PORT` | `9000`        | Puerto gRPC del servicio B|

---

## API

### `POST /v1/credit-evaluations`

```json
{
  "cedula": "1710034065",
  "amount": 5000.00,
  "termYears": 3,
  "salary": 1500.00
}
```

**Respuesta 201:**

```json
{
  "id": 1,
  "cedula": "1710034065",
  "amount": 5000.00,
  "termYears": 3,
  "salary": 1500.00,
  "evaluationDate": "2026-05-08T10:30:00",
  "status": "APROBADO",
  "score": 85,
  "totalMonthlyDebt": 430.00,
  "monthlyPaymentRequested": 138.89
}
```

### `GET /v1/credit-evaluations`

Retorna el historial de evaluaciones ordenado por fecha descendente.

---

## Regla de negocio

**APROBADO** si se cumplen ambas condiciones:
1. `score > 70`
2. `(deudaMensualExistente + cuotaSolicitada) < salario × 0.40`

La cédula es validada con el algoritmo de **Módulo 10**.

---

## Tests

```bash
# Microservicio A
cd microservice-a && ./mvnw test

# Microservicio B
cd microservice-b && ./mvnw test

# Frontend
cd frontend && npm test
```
