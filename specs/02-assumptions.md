# Supuestos (casos no definidos en el enunciado)

Registrados porque el enunciado pide decidirlos y documentarlos.

1. **Identificadores**: `empresaId`, `productoId`, `almacenId` son strings UUID o códigos alfanuméricos estables. En seed usamos códigos legibles (`emp-a`, `prod-1`, etc.).
2. **Unidades**: enteros ≥ 0. Cantidades de movimiento > 0.
3. **Tipo de movimiento**: solo `INGRESO` | `VENTA`.
4. **Idempotencia**: clave en cabecera `Idempotency-Key` (estándar HTTP). Alcance: por empresa. Si se reenvía el mismo body con la misma clave → 200 con el movimiento original. Si la misma clave llega con body distinto → `409 Conflict`.
5. **Stock en tránsito**: campo en `ProductoAlmacen`; no se mueve automáticamente con `POST /movimientos` (solo seed/datos de ejemplo o actualización futura). Las ventas/ingresos afectan solo `stockActual`.
6. **Ventas sin stock**: `409` con código `STOCK_INSUFICIENTE` (no se permite negativo).
7. **Producto/almacén inexistente**: `404`.
8. **Empresa**: si falta `X-Empresa-Id` → `400`. Los recursos deben pertenecer a esa empresa.
9. **Demanda diaria**: solo cuentan movimientos `VENTA` en la ventana `[corte-29d, corte]` inclusive (30 días calendario). Si no hay ventas → demanda 0. Con demanda 0: punto de reorden = stock de seguridad; si posición ≤ seguridad, bruta = seguridad − posición (puede sugerir).
10. **Fecha de corte**: query `fechaCorte` ISO date (`YYYY-MM-DD`), timezone interpretada como fecha calendario UTC para simplicidad de la prueba.
11. **Cobertura**: 14 días por defecto; query opcional `diasCobertura` para flexibilidad (documentado en OpenAPI).
12. **Redondeo a lote**: `ceil(bruta / lote) * lote` con `lote >= 1`. Si lote inválido en datos → error de datos.
13. **Concurrencia**: bloqueo de fila (`SELECT FOR UPDATE`) con isolation `ReadCommitted` sobre `ProductoAlmacen` al registrar venta/ingreso.
14. **Sugerencias**: solo productos del almacén de esa empresa; se omiten filas con cantidad sugerida 0.
