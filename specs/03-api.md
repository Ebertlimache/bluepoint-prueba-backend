# Contrato API

Base: `http://localhost:3000`  
Cabecera requerida: `X-Empresa-Id: <id>`

## POST /movimientos

Headers: `X-Empresa-Id`, `Idempotency-Key` (requerida)

```json
{
  "productoId": "prod-1",
  "almacenId": "alm-1",
  "tipo": "VENTA",
  "cantidad": 10
}
```

Respuesta 201/200:

```json
{
  "id": "...",
  "productoId": "prod-1",
  "almacenId": "alm-1",
  "tipo": "VENTA",
  "cantidad": 10,
  "stockResultante": 40,
  "idempotencyKey": "...",
  "createdAt": "..."
}
```

Errores: 400 validación, 404 recurso, 409 stock/idempotencia conflictiva.

## GET /stock

Query: `productoId`, `almacenId` (ambos requeridos)

```json
{
  "productoId": "prod-1",
  "almacenId": "alm-1",
  "stockActual": 50,
  "stockEnTransito": 20,
  "posicion": 70
}
```

## GET /sugerencias-reposicion

Query: `almacenId` (requerido), `fechaCorte` (requerido, `YYYY-MM-DD`), `diasCobertura` (opcional, default 14)

```json
{
  "almacenId": "alm-1",
  "fechaCorte": "2026-11-26",
  "diasCobertura": 14,
  "sugerencias": [
    {
      "productoId": "prod-1",
      "demandaDiaria": 10,
      "stockActual": 50,
      "stockEnTransito": 20,
      "posicion": 70,
      "puntoReorden": 90,
      "cantidadBruta": 160,
      "cantidadSugerida": 168,
      "motivo": "posición (70) ≤ punto de reorden (90); lote 24 → 168"
    }
  ]
}
```
