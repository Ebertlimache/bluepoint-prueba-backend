import { ApiProperty } from '@nestjs/swagger';
import { TipoMovimiento } from '@prisma/client';
import { IsEnum, IsInt, IsString, Min } from 'class-validator';

export class CreateMovimientoDto {
  @ApiProperty({ example: 'prod-a1' })
  @IsString()
  productoId!: string;

  @ApiProperty({ example: 'alm-a1' })
  @IsString()
  almacenId!: string;

  @ApiProperty({ enum: TipoMovimiento, example: TipoMovimiento.VENTA })
  @IsEnum(TipoMovimiento)
  tipo!: TipoMovimiento;

  @ApiProperty({ example: 10, minimum: 1 })
  @IsInt()
  @Min(1)
  cantidad!: number;
}
