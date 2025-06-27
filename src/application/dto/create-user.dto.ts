import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional, IsNumber } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  primerNombre: string;

  @IsString()
  @IsOptional()
  segundoNombre?: string;

  @IsString()
  @IsNotEmpty()
  primerApellido: string;

  @IsString()
  @IsOptional()
  segundoApellido?: string;

  @IsNumber()
  @IsOptional()
  tipoDocumentoId?: number = 1;

  @IsString()
  @IsOptional()
  numeroDocumento?: string;

  @IsEmail()
  @IsNotEmpty()
  correoElectronico: string;

  @IsString()
  @MinLength(6)
  contrasena: string;

  @IsString()
  @IsOptional()
  telefono?: string;

  @IsString()
  @IsNotEmpty()
  usuarioCreacion: string;
}
