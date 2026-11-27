# Bitácora de desarrollo

## 2026-11-27 — Arranque

1. Extraje el PDF a `enunciado.txt` y armé specs (`01`–`04`).
2. Decidí supuestos: `Idempotency-Key`, stock en tránsito solo lectura vía movimientos, ventana UTC de 30 días inclusiva.
3. Implementé `calcularReposicion` primero y el test del ejemplo 168.
4. Modelé Prisma multi-tenant y seed de 2 empresas.
5. Nest: movimientos (lock `FOR UPDATE` + ReadCommitted), stock, sugerencias.
6. Docker Compose + `docs/aws.md` + guía de sustentación.

## Cambios respecto a la primera idea

- **Auth JWT**: rechazada — el enunciado dice solo `X-Empresa-Id`.
- **Soft delete / eventos de tránsito**: pospuesto — no pedido; documentado en supuestos.
- **Prisma 7**: bajé a 5.22 por Node 20.15 local.

## Verificación vs aceptación

- Ejemplo 168 → unit test.
- Aislamiento → e2e / prueba manual con emp-a vs emp-b.
- Concurrencia → e2e con ventas paralelas.
