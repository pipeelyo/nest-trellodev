import { Controller, Get, Post, Body, Param, ParseIntPipe, UseGuards, Patch, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../../../infrastructure/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { TareaService } from '../../../application/services/tarea.service';
import { Tarea } from '../../../domain/entities/tarea.entity';
import { UpdateTareaDto } from '../dto/update-tarea.dto';
import { CreateTareaDto } from '../dto/create-tarea.dto';

@ApiTags('tareas')
@Controller('tareas')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class TareaController {
  constructor(private readonly tareaService: TareaService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva tarea' })
  @ApiResponse({ status: 201, description: 'Tarea creada exitosamente', type: Tarea })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 409, description: 'Ya existe una tarea con este nombre' })
  async create(
    @Body() createTareaDto: CreateTareaDto,
    @Req() req: any
  ): Promise<Tarea> {
    // Obtener el usuario autenticado del token JWT
    const user = req.user;
    
    // Si no se proporciona usuario en el DTO, usar el del token
    const usuarioCreacion = createTareaDto.usuarioCreacion || (user?.username || 'SISTEMA');
    
    // Crear el objeto con los datos necesarios para el servicio
    const tareaData = {
      ...createTareaDto,
      usuarioCreacion,
      usuarioActualizacion: usuarioCreacion
    };
    
    return this.tareaService.create(tareaData);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las tareas' })
  @ApiResponse({ status: 200, description: 'Lista de tareas', type: [Tarea] })
  async findAll(): Promise<Tarea[]> {
    return this.tareaService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una tarea por ID' })
  @ApiResponse({ status: 200, description: 'Tarea encontrada', type: Tarea })
  @ApiResponse({ status: 404, description: 'Tarea no encontrada' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Tarea> {
    return this.tareaService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ 
    summary: 'Actualizar una tarea existente',
    description: 'Actualiza los campos de una tarea existente, incluyendo el estado.'
  })
  @ApiResponse({ status: 200, description: 'Tarea actualizada', type: Tarea })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 404, description: 'Tarea no encontrada' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTareaDto: UpdateTareaDto,
    @Req() req: any
  ): Promise<Tarea> {
    // Obtener el usuario autenticado del token JWT
    const user = req.user;
    
    // Si se está actualizando el estado, registrar el cambio
    if (updateTareaDto.estado) {
      console.log(`Actualizando estado de la tarea ${id} a: ${updateTareaDto.estado}`);
    }
    
    // Agregar información del usuario que realiza la actualización
    const updateData = {
      ...updateTareaDto,
      usuarioActualizacion: user?.username || 'SISTEMA'
    };
    
    return this.tareaService.update(id, updateData);
  }
}
