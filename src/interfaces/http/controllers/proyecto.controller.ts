import { PROYECTO_SERVICE } from '../../../application/services/proyecto.service';
import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Put, 
  Delete, 
  UseGuards,
  ParseIntPipe,
  Query,
  DefaultValuePipe,
  Inject
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth,
  ApiQuery
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../infrastructure/guards/jwt-auth.guard';
import { ProyectoService } from '../../../application/services/proyecto.service';
import { Proyecto } from '../../../domain/entities/proyecto.entity';
import { CreateProyectoDto } from './dto/create-proyecto.dto';
import { UpdateProyectoDto } from './dto/update-proyecto.dto';
import { GetUser } from '../../../infrastructure/decorators/get-user.decorator';
import { User } from '../../../domain/entities/user.entity';

@ApiTags('proyectos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('proyectos')
export class ProyectoController {
  constructor(
    @Inject(PROYECTO_SERVICE)
    private readonly proyectoService: ProyectoService
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo proyecto' })
  @ApiResponse({ status: 201, description: 'El proyecto ha sido creado exitosamente.', type: Proyecto })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos.' })
  @ApiResponse({ status: 409, description: 'Ya existe un proyecto con este nombre.' })
  create(
    @Body() createProyectoDto: CreateProyectoDto,
    @GetUser() user: User
  ): Promise<Proyecto> {
    return this.proyectoService.create({
      ...createProyectoDto,
      tareas: [],
      fechaInicio: createProyectoDto.fechaInicio || new Date(),
      fechaFin: createProyectoDto.fechaFin,
      usuarioCreacion: user.correoElectronico,
      fechaHoraCreacion: new Date(),
      fechaHoraActualizacion: new Date(),
      usuarioActualizacion: user.correoElectronico
    });
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los proyectos' })
  @ApiResponse({ status: 200, description: 'Lista de proyectos', type: [Proyecto] })
  @ApiQuery({ name: 'estado', required: false, enum: ['ACTIVO', 'INACTIVO'] })
  findAll(
    @Query('estado') estado?: 'ACTIVO' | 'INACTIVO'
  ): Promise<Proyecto[]> {
    if (estado) {
      // Filtrar por estado si se proporciona
      return this.proyectoService.findAll().then(proyectos => 
        proyectos.filter(p => p.estado === estado)
      );
    }
    return this.proyectoService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un proyecto por ID' })
  @ApiResponse({ status: 200, description: 'El proyecto solicitado', type: Proyecto })
  @ApiResponse({ status: 404, description: 'Proyecto no encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Proyecto> {
    return this.proyectoService.findById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un proyecto' })
  @ApiResponse({ status: 200, description: 'El proyecto ha sido actualizado', type: Proyecto })
  @ApiResponse({ status: 404, description: 'Proyecto no encontrado' })
  @ApiResponse({ status: 409, description: 'Ya existe un proyecto con este nombre' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProyectoDto: UpdateProyectoDto,
    @GetUser() user: User
  ): Promise<Proyecto> {
    return this.proyectoService.update(id, {
      ...updateProyectoDto,
      usuarioActualizacion: user.correoElectronico
    });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un proyecto' })
  @ApiResponse({ status: 200, description: 'El proyecto ha sido eliminado' })
  @ApiResponse({ status: 404, description: 'Proyecto no encontrado' })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.proyectoService.delete(id);
  }
}
