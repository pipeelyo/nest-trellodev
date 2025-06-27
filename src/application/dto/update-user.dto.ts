import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsString, IsOptional, IsEmail, MinLength, IsNumber } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsString()
  @IsOptional()
  nombre?: string;

  @IsString()
  @IsOptional()
  segundoNombre?: string;

  @IsString()
  @IsOptional()
  apellido?: string;

  @IsString()
  @IsOptional()
  segundoApellido?: string;

  @IsNumber()
  @IsOptional()
  tipoDocumentoId?: number;

  @IsString()
  @IsOptional()
  numeroDocumento?: string;

  @IsEmail()
  @IsOptional()
  correoElectronico?: string;

  @IsString()
  @MinLength(6)
  @IsOptional()
  contrasena?: string;

  @IsString()
  @IsOptional()
  telefono?: string;

  @IsString()
  @IsOptional()
  estado?: 'ACTIVO' | 'INACTIVO';
  
  @IsString()
  @IsOptional()
  usuarioActualizacion?: string;
}
