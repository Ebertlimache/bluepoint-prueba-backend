# Prueba técnica Bluepoint AI — API de reposición de inventario

Autor: Ebert Antonio Limache Lopez  
Stack: TypeScript (strict) · NestJS · Prisma · PostgreSQL · Docker Compose

## Levantar (máx. 3 comandos)

```bash
docker compose up --build -d
```

Listo. API: http://localhost:3000 · Swagger: http://localhost:3000/docs

Postgres **no se publica al host**: API y DB hablan por la red interna de Docker (`db:5432`). Así no choca con un Postgres local en 5432.

(Opcional) Ver logs: `docker compose logs -f api`  
(Opcional) Bajar: `docker compose down -v`

## Flujo SDD (resumen ≤ 1 página)

1. **Especificar** a partir del PDF → `specs/01-requirements.md`  
2. **Cerrar huecos** → `specs/02-assumptions.md`  
3. **Contrato HTTP** → `specs/03-api.md`  
4. **Criterios** → `specs/04-acceptance.md`  
5. **Dominio puro** → `api/src/domain/replenishment/` (fórmulas sin Nest/DB)  
6. **Infra Nest/Prisma/Docker** guiada por esas specs  
7. **Verificar** tests + seed del ejemplo (sugerida **168**)  
8. **Bitácora / prompts** → `specs/bitacora.md`, `specs/prompts/ia-uso.md`

Herramientas: Nest CLI, Prisma, Jest, Docker Compose.  
Trabajo así porque Bluepoint evalúa **claridad y orden (70/100)** y pide explicar el flujo en sustentación.

Cómo la spec guió el código: los endpoints y la regla de cálculo salieron de `01`+`03`; concurrencia/idempotencia de `02`; el seed reproduce el ejemplo de `01`.  
Cambios: ver `specs/bitacora.md`.  
IA crítica: ver `specs/prompts/ia-uso.md` (2+ correcciones/rechazos).

## Mapa del repo

| Ruta | Para qué |
|------|----------|
| `specs/` | Flujo SDD (requisitos, supuestos, API, aceptación, bitácora, prompts) |
| `docs/aws.md` | Diseño AWS pedido |
| `api/src/domain/` | Regla de reposición pura |
| `api/src/movimientos\|stock\|sugerencias` | Casos de uso Nest |
| `api/prisma/` | Schema, migración, seed (2 empresas) |
| `docker-compose.yml` | PostgreSQL + API |

## Plantillas / terceros

- Scaffold NestJS CLI (plantilla oficial).  
- Prisma / PostgreSQL / Docker imágenes oficiales.

## Desarrollo local (API en host + DB en Docker)

Publica Postgres solo en tu máquina (puerto 15432) con el overlay `dev`:

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d db
cd api
npm ci
npx prisma migrate deploy
npx prisma db seed
npm run start:dev
```

## Tests

```bash
cd api
npm test                 # incluye ejemplo 168
# e2e: primero levanta DB con el overlay dev (puerto host 15432)
npm run test:e2e
```
