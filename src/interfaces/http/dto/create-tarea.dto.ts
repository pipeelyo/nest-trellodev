import { IsString, IsOptional, IsEnum, IsArray, IsNumber } from 'class-validator';

export class CreateTareaDto {
  @IsString()
  nombre: string;

  @IsString()
  @IsOptional()
  descripcion: string = '';

  @IsString()
  @IsOptional()
  estado: string = 'ACTIVO';

  @IsString()
  @IsOptional()
  url: string = '';

  @IsString()
  usuarioCreacion: string;

  @IsArray()
  @IsOptional()
  @IsNumber({}, { each: true })
  proyectoIds?: number[];
}
