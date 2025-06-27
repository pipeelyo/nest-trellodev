import { IsString, IsNotEmpty, IsOptional, IsEnum, Length, IsDate } from 'class-validator';

export class CreateTipoDocumentoDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 256)
  nombreTipoDocumento: string;

  @IsString()
  @IsNotEmpty()
  usuarioCreacion: string;

  @IsDate()
  @IsOptional()
  fechaHoraCreacion: Date = new Date();

  @IsString()
  @IsEnum(['ACTIVO', 'INACTIVO'])
  estado: 'ACTIVO' | 'INACTIVO' = 'ACTIVO';
}
