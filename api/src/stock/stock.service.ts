import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StockService {
  constructor(private readonly prisma: PrismaService) {}

  async get(empresaId: string, productoId: string, almacenId: string) {
    const row = await this.prisma.productoAlmacen.findFirst({
      where: { empresaId, productoId, almacenId },
    });
    if (!row) {
      throw new NotFoundException({
        code: 'PRODUCTO_ALMACEN_NO_ENCONTRADO',
        message: 'No existe stock para producto/almacén en esta empresa',
      });
    }
    return {
      productoId: row.productoId,
      almacenId: row.almacenId,
      stockActual: row.stockActual,
      stockEnTransito: row.stockEnTransito,
      posicion: row.stockActual + row.stockEnTransito,
    };
  }
}
