import { Controller, Get, Query } from '@nestjs/common';
import { ApiHeader, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Matches, Min } from 'class-validator';
import { EmpresaId } from '../common/empresa.header';
import { SugerenciasService } from './sugerencias.service';

class SugerenciasQueryDto {
  @IsString()
  almacenId!: string;

  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  fechaCorte!: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  diasCobertura?: number;
}

@ApiTags('sugerencias-reposicion')
@ApiHeader({ name: 'X-Empresa-Id', required: true })
@Controller('sugerencias-reposicion')
export class SugerenciasController {
  constructor(private readonly service: SugerenciasService) {}

  @Get()
  @ApiQuery({ name: 'almacenId' })
  @ApiQuery({ name: 'fechaCorte', example: '2026-11-26' })
  @ApiQuery({ name: 'diasCobertura', required: false, example: 14 })
  get(@EmpresaId() empresaId: string, @Query() query: SugerenciasQueryDto) {
    return this.service.sugerir(
      empresaId,
      query.almacenId,
      query.fechaCorte,
      query.diasCobertura ?? 14,
    );
  }
}
