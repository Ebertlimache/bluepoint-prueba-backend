import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.movimiento.deleteMany();
  await prisma.productoAlmacen.deleteMany();
  await prisma.producto.deleteMany();
  await prisma.almacen.deleteMany();
  await prisma.empresa.deleteMany();

  await prisma.empresa.createMany({
    data: [
      { id: 'emp-a', nombre: 'Distribuidora Andina' },
      { id: 'emp-b', nombre: 'Distribuidora Pacífico' },
    ],
  });

  await prisma.almacen.createMany({
    data: [
      { id: 'alm-a1', empresaId: 'emp-a', nombre: 'Almacén Lima Norte A' },
      { id: 'alm-b1', empresaId: 'emp-b', nombre: 'Almacén Callao B' },
    ],
  });

  await prisma.producto.createMany({
    data: [
      {
        id: 'prod-a1',
        empresaId: 'emp-a',
        sku: 'SKU-ARROZ-1KG',
        nombre: 'Arroz 1kg',
      },
      {
        id: 'prod-b1',
        empresaId: 'emp-b',
        sku: 'SKU-AZUCAR-1KG',
        nombre: 'Azúcar 1kg',
      },
    ],
  });

  await prisma.productoAlmacen.createMany({
    data: [
      {
        empresaId: 'emp-a',
        productoId: 'prod-a1',
        almacenId: 'alm-a1',
        stockActual: 50,
        stockEnTransito: 20,
        plazoEntregaDias: 7,
        stockSeguridad: 20,
        loteCompra: 24,
      },
      {
        empresaId: 'emp-b',
        productoId: 'prod-b1',
        almacenId: 'alm-b1',
        stockActual: 100,
        stockEnTransito: 0,
        plazoEntregaDias: 5,
        stockSeguridad: 10,
        loteCompra: 10,
      },
    ],
  });

  await prisma.movimiento.create({
    data: {
      empresaId: 'emp-a',
      productoId: 'prod-a1',
      almacenId: 'alm-a1',
      tipo: 'VENTA',
      cantidad: 300,
      stockResultante: 50,
      idempotencyKey: 'seed-venta-ejemplo-300',
      createdAt: new Date('2026-11-26T12:00:00.000Z'),
    },
  });

  console.log('Seed OK: emp-a / emp-b');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
