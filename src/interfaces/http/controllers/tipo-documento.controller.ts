import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Put, 
  Delete, 
  UseGuards,
  Query,
  ParseIntPipe,
  DefaultValuePipe
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth,
  ApiQuery
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../infrastructure/guards/jwt-auth.guard';
import { TipoDocumentoService } from '../../../application/services/tipo-documento.service';
import { TipoDocumento } from '../../../domain/entities/tipo-documento.entity';
import { CreateTipoDocumentoDto } from '../dto/create-tipo-documento.dto';
import { UpdateTipoDocumentoDto } from '@/interfaces/http/dto/update-tipo-documento.dto';

@ApiTags('tipos-documento')
@Controller('tipos-documento')
export class TipoDocumentoController {
  constructor(private readonly tipoDocumentoService: TipoDocumentoService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todos los tipos de documento activos' })
  @ApiResponse({ status: 200, description: 'Lista de tipos de documento', type: [TipoDocumento] })
  @ApiQuery({ name: 'includeInactive', required: false, type: Boolean, description: 'Incluir tipos de documento inactivos' })
  async findAll(
    @Query('includeInactive', new DefaultValuePipe(false)) includeInactive: boolean
  ): Promise<TipoDocumento[]> {
    if (includeInactive) {
      // Si necesitamos incluir inactivos, implementar un nuevo método en el servicio
      // Por ahora, solo devolvemos los activos
      return this.tipoDocumentoService.findAll();
    }
    return this.tipoDocumentoService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un tipo de documento por ID' })
  @ApiResponse({ status: 200, description: 'Tipo de documento encontrado', type: TipoDocumento })
  @ApiResponse({ status: 404, description: 'Tipo de documento no encontrado' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<TipoDocumento> {
    return this.tipoDocumentoService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo tipo de documento' })
  @ApiResponse({ status: 201, description: 'Tipo de documento creado', type: TipoDocumento })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 409, description: 'El tipo de documento ya existe' })
  async create(@Body() createTipoDocumentoDto: CreateTipoDocumentoDto): Promise<TipoDocumento> {
    return this.tipoDocumentoService.create(createTipoDocumentoDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un tipo de documento' })
  @ApiResponse({ status: 200, description: 'Tipo de documento actualizado', type: TipoDocumento })
  @ApiResponse({ status: 404, description: 'Tipo de documento no encontrado' })
  @ApiResponse({ status: 409, description: 'Conflicto con otro tipo de documento' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTipoDocumentoDto: UpdateTipoDocumentoDto,
  ): Promise<TipoDocumento> {
    return this.tipoDocumentoService.update(id, updateTipoDocumentoDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un tipo de documento (marcar como inactivo)' })
  @ApiResponse({ status: 200, description: 'Tipo de documento eliminado' })
  @ApiResponse({ status: 404, description: 'Tipo de documento no encontrado' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.tipoDocumentoService.remove(id);
  }
}
