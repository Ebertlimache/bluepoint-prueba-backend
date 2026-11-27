import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { MovimientosModule } from './movimientos/movimientos.module';
import { StockModule } from './stock/stock.module';
import { SugerenciasModule } from './sugerencias/sugerencias.module';

@Module({
  imports: [PrismaModule, MovimientosModule, StockModule, SugerenciasModule],
})
export class AppModule {}
