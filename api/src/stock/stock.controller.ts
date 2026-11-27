import { Controller, Get, Query } from '@nestjs/common';
import { ApiHeader, ApiQuery, ApiTags } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { EmpresaId } from '../common/empresa.header';
import { StockService } from './stock.service';

class StockQueryDto {
  @IsString()
  productoId!: string;

  @IsString()
  almacenId!: string;
}

@ApiTags('stock')
@ApiHeader({ name: 'X-Empresa-Id', required: true })
@Controller('stock')
export class StockController {
  constructor(private readonly service: StockService) {}

  @Get()
  @ApiQuery({ name: 'productoId' })
  @ApiQuery({ name: 'almacenId' })
  get(
    @EmpresaId() empresaId: string,
    @Query() query: StockQueryDto,
  ) {
    return this.service.get(empresaId, query.productoId, query.almacenId);
  }
}
