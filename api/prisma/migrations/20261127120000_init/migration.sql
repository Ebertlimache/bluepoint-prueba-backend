-- CreateEnum
CREATE TYPE "TipoMovimiento" AS ENUM ('INGRESO', 'VENTA');

-- CreateTable
CREATE TABLE "Empresa" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Empresa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Almacen" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Almacen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Producto" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Producto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductoAlmacen" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "productoId" TEXT NOT NULL,
    "almacenId" TEXT NOT NULL,
    "stockActual" INTEGER NOT NULL DEFAULT 0,
    "stockEnTransito" INTEGER NOT NULL DEFAULT 0,
    "plazoEntregaDias" INTEGER NOT NULL,
    "stockSeguridad" INTEGER NOT NULL,
    "loteCompra" INTEGER NOT NULL,

    CONSTRAINT "ProductoAlmacen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Movimiento" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "productoId" TEXT NOT NULL,
    "almacenId" TEXT NOT NULL,
    "tipo" "TipoMovimiento" NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "stockResultante" INTEGER NOT NULL,
    "idempotencyKey" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Movimiento_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Almacen_empresaId_idx" ON "Almacen"("empresaId");

-- CreateIndex
CREATE INDEX "Producto_empresaId_idx" ON "Producto"("empresaId");

-- CreateIndex
CREATE UNIQUE INDEX "Producto_empresaId_sku_key" ON "Producto"("empresaId", "sku");

-- CreateIndex
CREATE INDEX "ProductoAlmacen_empresaId_almacenId_idx" ON "ProductoAlmacen"("empresaId", "almacenId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductoAlmacen_productoId_almacenId_key" ON "ProductoAlmacen"("productoId", "almacenId");

-- CreateIndex
CREATE INDEX "Movimiento_empresaId_productoId_almacenId_tipo_createdAt_idx" ON "Movimiento"("empresaId", "productoId", "almacenId", "tipo", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Movimiento_empresaId_idempotencyKey_key" ON "Movimiento"("empresaId", "idempotencyKey");

-- AddForeignKey
ALTER TABLE "Almacen" ADD CONSTRAINT "Almacen_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Producto" ADD CONSTRAINT "Producto_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductoAlmacen" ADD CONSTRAINT "ProductoAlmacen_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductoAlmacen" ADD CONSTRAINT "ProductoAlmacen_almacenId_fkey" FOREIGN KEY ("almacenId") REFERENCES "Almacen"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Movimiento" ADD CONSTRAINT "Movimiento_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Movimiento" ADD CONSTRAINT "Movimiento_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Movimiento" ADD CONSTRAINT "Movimiento_almacenId_fkey" FOREIGN KEY ("almacenId") REFERENCES "Almacen"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
