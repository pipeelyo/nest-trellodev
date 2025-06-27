import { IsString, IsNotEmpty, IsOptional, IsIn, IsDateString } from 'class-validator';

export class CreateProyectoDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsOptional()
  descripcion: string = '';

  @IsString()
  @IsOptional()
  estado: string = 'ACTIVO';

  @IsDateString()
  @IsOptional()
  fechaInicio?: Date;

  @IsDateString()
  @IsOptional()
  fechaFin?: Date;

  @IsString()
  @IsNotEmpty()
  usuarioCreacion: string;
}
