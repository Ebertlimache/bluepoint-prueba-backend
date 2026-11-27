# Diseño en AWS (sin desplegar)

## Diagrama lógico

```text
Clientes (distribuidoras)
        |
        v
   [ALB / API Gateway]
        |
        v
   [NestJS API]  <--- Secrets Manager (DATABASE_URL)
        |
        v
   [RDS PostgreSQL Multi-AZ]
```

Opcional a futuro: cola SQS + worker para recálculo masivo de sugerencias.

## 1. ¿Lambda o EC2?

**Elegiría EC2 (o mejor ECS Fargate) para el servicio NestJS**, no Lambda “tal cual”.

Motivos:
- NestJS + Prisma mantiene **pool de conexiones** a PostgreSQL; en Lambda cold starts y miles de conexiones concurrentes saturan RDS salvo patrones extra (RDS Proxy + Data API).
- El dominio tiene **transacciones serializables y `FOR UPDATE`**: encaja mejor con un proceso de larga vida.
- Latencia predecible para API síncrona de inventario.

Lambda tendría sentido más adelante para jobs batch (recalcular sugerencias por empresa) o webhooks esporádicos, no como runtime principal de esta API.

## 2. PostgreSQL y secretos

- **RDS PostgreSQL** (Multi-AZ en prod) detrás de VPC privada.
- **RDS Proxy** si el cómputo escala a muchas tareas (limita conexiones).
- Secretos (`DATABASE_URL`, claves) en **AWS Secrets Manager**, inyectados al task de ECS en el arranque; rotación con política; nunca en el repo.
- Migraciones Prisma en el pipeline/entrypoint controlado (`migrate deploy`), no desde laptops.

## 3. ¿Cuándo separar el cálculo de reposición?

Separaría el cálculo a otro microservicio cuando:
- El recálculo sea **pesado o masivo** (miles de SKU × almacenes) y afecte latencia de `POST /movimientos`.
- Varios consumidores necesiten la misma regla (API, batch nocturno, reportes).

Comunicación:
- **Síncrona**: HTTP interno / gRPC para “calcular ahora” en la consulta de sugerencias.
- **Asíncrona**: publicar evento `VentaRegistrada` en **SNS/SQS** o EventBridge; el servicio de reposición actualiza proyecciones; la API lee un modelo precomputado.

Para el tamaño actual del reto, **mantener el cálculo en proceso (módulo de dominio puro) es correcto**: ya está desacoplado del framework y se puede extraer sin reescribir la regla.
