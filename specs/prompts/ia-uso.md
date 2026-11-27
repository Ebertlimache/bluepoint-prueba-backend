# Uso de IA — casos (para el README / sustentación)

## Caso 1 — Corregí

La IA propuso restar stock sin transacción.  
**Corregí** a `SELECT … FOR UPDATE` + isolation `ReadCommitted` para ventas concurrentes.

## Caso 2 — Rechacé

La IA sugirió autenticación JWT “porque es best practice”.  
**Rechacé**: el enunciado exige solo `X-Empresa-Id` y prohíbe inventar requisitos de seguridad no pedidos.

## Caso 3 — Corregí (cálculo)

Un borrador usó `Math.round` al lote.  
**Corregí** a `Math.ceil(bruta / lote) * lote` según enunciado (160 → 168 con lote 24).
