import { IsString, IsOptional, IsEnum, IsArray, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { EstadoTarea } from '@/domain/entities/tarea.entity';

export class CreateTareaDto {
  @ApiProperty({ description: 'Nombre de la tarea', required: true })
  @IsString()
  nombre: string;

  @ApiProperty({ description: 'Descripción de la tarea', required: false, default: '' })
  @IsString()
  @IsOptional()
  descripcion: string = '';

  @ApiProperty({ 
    description: 'Estado inicial de la tarea', 
    enum: EstadoTarea, 
    default: EstadoTarea.PENDIENTE,
    required: false 
  })
  @IsEnum(EstadoTarea)
  @IsOptional()
  estado: EstadoTarea = EstadoTarea.PENDIENTE;

  @ApiProperty({ description: 'URL relacionada con la tarea', required: false, default: '' })
  @IsString()
  @IsOptional()
  url: string = '';

  @ApiProperty({ description: 'Usuario que crea la tarea', required: true })
  @IsString()
  usuarioCreacion: string = 'SISTEMA';

  @ApiProperty({ 
    description: 'IDs de proyectos a los que pertenece la tarea', 
    type: [Number],
    required: false 
  })
  @IsArray()
  @IsOptional()
  @IsNumber({}, { each: true })
  proyectoIds?: number[];
}
