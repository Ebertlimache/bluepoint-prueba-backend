# Criterios de aceptación

- [x] Docker Compose levanta API + PostgreSQL.
- [x] Seed crea 2 empresas aisladas con datos del ejemplo de cálculo.
- [x] Ejemplo: demanda 10, punto 90, posición 70, sugerida 168.
- [x] Empresa A no ve ni modifica datos de empresa B.
- [x] Ventas concurrentes no dejan stock negativo.
- [x] Misma `Idempotency-Key` no duplica movimiento.
- [x] Swagger en `/docs`.
- [x] Cálculo de reposición vive en módulo de dominio puro (sin Nest/Prisma).
- [x] Tests automatizados cubren cálculo, aislamiento y concurrencia.
- [x] `docs/aws.md` presente.
- [x] README explica SDD + cómo levantar (≤ 3 comandos).
