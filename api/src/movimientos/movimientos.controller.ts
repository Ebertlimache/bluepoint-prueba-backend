import {
  BadRequestException,
  Body,
  Controller,
  Headers,
  HttpCode,
  Post,
} from '@nestjs/common';
import { ApiHeader, ApiTags } from '@nestjs/swagger';
import { EmpresaId } from '../common/empresa.header';
import { CreateMovimientoDto } from './dto/create-movimiento.dto';
import { MovimientosService } from './movimientos.service';

@ApiTags('movimientos')
@ApiHeader({ name: 'X-Empresa-Id', required: true })
@ApiHeader({ name: 'Idempotency-Key', required: true })
@Controller('movimientos')
export class MovimientosController {
  constructor(private readonly service: MovimientosService) {}

  @Post()
  @HttpCode(200)
  create(
    @EmpresaId() empresaId: string,
    @Headers('idempotency-key') idempotencyKey: string | undefined,
    @Body() dto: CreateMovimientoDto,
  ) {
    if (!idempotencyKey?.trim()) {
      throw new BadRequestException({
        code: 'IDEMPOTENCY_KEY_REQUERIDA',
        message: 'Cabecera Idempotency-Key es obligatoria',
      });
    }
    return this.service.registrar(empresaId, idempotencyKey.trim(), dto);
  }
}
