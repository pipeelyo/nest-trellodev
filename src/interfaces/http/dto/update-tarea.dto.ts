import { IsString, IsOptional, IsEnum, IsArray, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { EstadoTarea } from '../../../../domain/entities/tarea.entity';

export class UpdateTareaDto {
  @ApiProperty({ description: 'Nuevo nombre de la tarea', required: false })
  @IsString()
  @IsOptional()
  nombre?: string;

  @ApiProperty({ description: 'Nueva descripción de la tarea', required: false })
  @IsString()
  @IsOptional()
  descripcion?: string;

  @ApiProperty({ 
    description: 'Nuevo estado de la tarea', 
    enum: Object.values(EstadoTarea),
    required: false 
  })
  @IsEnum(EstadoTarea)
  @IsOptional()
  estado?: EstadoTarea;

  @ApiProperty({ description: 'URL relacionada con la tarea', required: false })
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
