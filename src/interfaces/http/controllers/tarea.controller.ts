import { Controller, Get, Post, Body, Param, ParseIntPipe, UseGuards, Patch } from '@nestjs/common';
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
  async create(@Body() createTareaDto: CreateTareaDto): Promise<Tarea> {
    return this.tareaService.create(createTareaDto);
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
  @ApiOperation({ summary: 'Actualizar una tarea existente' })
  @ApiResponse({ status: 200, description: 'Tarea actualizada', type: Tarea })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 404, description: 'Tarea no encontrada' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTareaDto: UpdateTareaDto,
  ): Promise<Tarea> {
    return this.tareaService.update(id, updateTareaDto);
  }
}
