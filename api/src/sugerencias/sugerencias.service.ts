import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { calcularReposicion } from '../domain/replenishment/replenishment.calculator';

@Injectable()
export class SugerenciasService {
  constructor(private readonly prisma: PrismaService) {}

  async sugerir(
    empresaId: string,
    almacenId: string,
    fechaCorte: string,
    diasCobertura = 14,
  ) {
    const almacen = await this.prisma.almacen.findFirst({
      where: { id: almacenId, empresaId },
    });
    if (!almacen) {
      throw new NotFoundException({
        code: 'ALMACEN_NO_ENCONTRADO',
        message: 'Almacén no encontrado para esta empresa',
      });
    }

    const corte = new Date(`${fechaCorte}T23:59:59.999Z`);
    const inicio = new Date(corte);
    inicio.setUTCDate(inicio.getUTCDate() - 29);
    inicio.setUTCHours(0, 0, 0, 0);

    const rows = await this.prisma.productoAlmacen.findMany({
      where: { empresaId, almacenId },
    });

    const sugerencias = [];

    for (const row of rows) {
      const agg = await this.prisma.movimiento.aggregate({
        where: {
          empresaId,
          productoId: row.productoId,
          almacenId,
          tipo: 'VENTA',
          createdAt: { gte: inicio, lte: corte },
        },
        _sum: { cantidad: true },
      });

      const unidadesVendidas30d = agg._sum.cantidad ?? 0;
      const calc = calcularReposicion({
        unidadesVendidas30d,
        stockActual: row.stockActual,
        stockEnTransito: row.stockEnTransito,
        plazoEntregaDias: row.plazoEntregaDias,
        stockSeguridad: row.stockSeguridad,
        loteCompra: row.loteCompra,
        diasCobertura,
      });

      if (calc.cantidadSugerida <= 0) continue;

      sugerencias.push({
        productoId: row.productoId,
        demandaDiaria: calc.demandaDiaria,
        stockActual: row.stockActual,
        stockEnTransito: row.stockEnTransito,
        posicion: calc.posicion,
        puntoReorden: calc.puntoReorden,
        cantidadBruta: calc.cantidadBruta,
        cantidadSugerida: calc.cantidadSugerida,
        motivo: calc.motivo,
      });
    }

    return {
      almacenId,
      fechaCorte,
      diasCobertura,
      ventanaVentas: {
        desde: inicio.toISOString().slice(0, 10),
        hasta: fechaCorte,
      },
      sugerencias,
    };
  }
}
