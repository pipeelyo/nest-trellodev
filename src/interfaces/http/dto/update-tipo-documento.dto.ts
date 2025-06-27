import { PartialType } from '@nestjs/mapped-types';
import { CreateTipoDocumentoDto } from './create-tipo-documento.dto';
import { IsString, IsOptional, IsEnum, Length } from 'class-validator';

export class UpdateTipoDocumentoDto extends PartialType(CreateTipoDocumentoDto) {
  @IsString()
  @IsOptional()
  @Length(1, 256)
  nombreTipoDocumento?: string;

  @IsString()
  @IsOptional()
  @IsEnum(['ACTIVO', 'INACTIVO'])
  estado?: 'ACTIVO' | 'INACTIVO';

  @IsString()
  @IsOptional()
  usuarioActualizacion?: string;
}
