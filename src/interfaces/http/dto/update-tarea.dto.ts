import { IsString, IsOptional, IsEnum, IsArray, IsNumber } from 'class-validator';

export class UpdateTareaDto {
  @IsString()
  @IsOptional()
  nombre?: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsString()
  @IsOptional()
  @IsEnum(['ACTIVO', 'INACTIVO'])
  estado?: 'ACTIVO' | 'INACTIVO';

  @IsString()
  @IsOptional()
  url?: string;

  @IsString()
  @IsOptional()
  usuarioActualizacion?: string;

  @IsArray()
  @IsOptional()
  @IsNumber({}, { each: true })
  proyectoIds?: number[];
}
