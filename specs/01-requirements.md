# Requisitos (extraídos del enunciado)

## Objetivo

API pequeña de reposición de inventario multi-empresa (distribuidoras).

## Funciones

1. `POST /movimientos` — registrar ingreso o venta en un almacén.
   - Stock nunca negativo (aunque ventas sean concurrentes).
   - Idempotencia: misma clave no duplica el movimiento.
2. `GET /stock` — stock actual y en tránsito por producto y almacén.
3. `GET /sugerencias-reposicion` — qué pedir y por qué, por almacén y fecha de corte.
4. Cabecera `X-Empresa-Id` — aislamiento estricto entre empresas. Sin autenticación.

## Regla de cálculo (cobertura por defecto = 14 días)

| Paso | Fórmula |
|------|---------|
| Demanda diaria | Unidades vendidas en los 30 días que terminan en la fecha de corte (incluida) ÷ 30 |
| Posición | Stock actual + stock en tránsito |
| Punto de reorden | Demanda diaria × plazo de entrega + stock de seguridad |
| Condición | Reponer si posición ≤ punto de reorden |
| Cantidad bruta | Demanda diaria × (plazo + cobertura) + seguridad − posición |
| Cantidad sugerida | Bruta redondeada hacia arriba al múltiplo del lote; solo si > 0 |

## Ejemplo de aceptación

Vendidas 300 en 30 días → demanda 10/día.  
Plazo 7, seguridad 20, stock 50, tránsito 20, lote 24.  
Punto reorden = 90, posición = 70, bruta = 160, sugerida = 168.

## Stack obligatorio

TypeScript strict, NestJS, Prisma, PostgreSQL, migraciones, seed 2 empresas, Docker Compose, validación, errores consistentes, OpenAPI, tests (cálculo, aislamiento, concurrencia).
