import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TipoMovimiento } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMovimientoDto } from './dto/create-movimiento.dto';

@Injectable()
export class MovimientosService {
  constructor(private readonly prisma: PrismaService) {}

  async registrar(
    empresaId: string,
    idempotencyKey: string,
    dto: CreateMovimientoDto,
  ) {
    const existing = await this.prisma.movimiento.findUnique({
      where: {
        empresaId_idempotencyKey: { empresaId, idempotencyKey },
      },
    });

    if (existing) {
      const same =
        existing.productoId === dto.productoId &&
        existing.almacenId === dto.almacenId &&
        existing.tipo === dto.tipo &&
        existing.cantidad === dto.cantidad;
      if (!same) {
        throw new ConflictException({
          code: 'IDEMPOTENCY_CONFLICT',
          message:
            'La Idempotency-Key ya se usó con un cuerpo distinto',
        });
      }
      return existing;
    }

    return this.prisma.$transaction(async (tx) => {
      const pa = await tx.$queryRaw<
        Array<{
          id: string;
          stockActual: number;
          empresaId: string;
        }>
      >`
          SELECT id, "stockActual", "empresaId"
          FROM "ProductoAlmacen"
          WHERE "empresaId" = ${empresaId}
            AND "productoId" = ${dto.productoId}
            AND "almacenId" = ${dto.almacenId}
          FOR UPDATE
        `;

      if (!pa.length) {
        throw new NotFoundException({
          code: 'PRODUCTO_ALMACEN_NO_ENCONTRADO',
          message: 'No existe producto/almacén para esta empresa',
        });
      }

      const row = pa[0];
      let stockResultante = row.stockActual;

      if (dto.tipo === TipoMovimiento.VENTA) {
        if (row.stockActual < dto.cantidad) {
          throw new ConflictException({
            code: 'STOCK_INSUFICIENTE',
            message: `Stock insuficiente (${row.stockActual}) para venta de ${dto.cantidad}`,
          });
        }
        stockResultante = row.stockActual - dto.cantidad;
      } else {
        stockResultante = row.stockActual + dto.cantidad;
      }

      await tx.productoAlmacen.update({
        where: { id: row.id },
        data: { stockActual: stockResultante },
      });

      try {
        return await tx.movimiento.create({
          data: {
            empresaId,
            productoId: dto.productoId,
            almacenId: dto.almacenId,
            tipo: dto.tipo,
            cantidad: dto.cantidad,
            stockResultante,
            idempotencyKey,
          },
        });
      } catch (e: unknown) {
        const again = await tx.movimiento.findUnique({
          where: {
            empresaId_idempotencyKey: { empresaId, idempotencyKey },
          },
        });
        if (again) return again;
        throw e;
      }
    });
  }
}
