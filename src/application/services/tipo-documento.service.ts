import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { TipoDocumento } from '../../domain/entities/tipo-documento.entity';
import { TipoDocumentoRepository } from '../../domain/ports/tipo-documento.repository';

@Injectable()
export class TipoDocumentoService {
  constructor(
    private readonly tipoDocumentoRepository: TipoDocumentoRepository,
  ) {}

  async findAll(): Promise<TipoDocumento[]> {
    return this.tipoDocumentoRepository.findAll();
  }

  async findById(id: number): Promise<TipoDocumento> {
    const tipoDocumento = await this.tipoDocumentoRepository.findById(id);
    if (!tipoDocumento) {
      throw new NotFoundException(`Tipo de documento con ID ${id} no encontrado`);
    }
    return tipoDocumento;
  }

  async create(tipoDocumento: Omit<TipoDocumento, 'tipoDocumentoId'>): Promise<TipoDocumento> {
    // Verificar si ya existe un tipo de documento con el mismo nombre
    const existing = await this.tipoDocumentoRepository.findAll();
    if (existing.some(td => td.nombreTipoDocumento.toLowerCase() === tipoDocumento.nombreTipoDocumento.toLowerCase())) {
      throw new ConflictException('Ya existe un tipo de documento con este nombre');
    }

    return this.tipoDocumentoRepository.save({
      ...tipoDocumento,
      estado: 'ACTIVO',
      fechaHoraCreacion: new Date(),
    } as TipoDocumento);
  }

  async update(id: number, updateData: Partial<TipoDocumento>): Promise<TipoDocumento> {
    const tipoDocumento = await this.findById(id);
    
    // Verificar si se está actualizando el nombre y si ya existe otro con el mismo nombre
    if (updateData.nombreTipoDocumento) {
      const existing = await this.tipoDocumentoRepository.findAll();
      if (existing.some(td => 
        td.tipoDocumentoId !== id && 
        td.nombreTipoDocumento.toLowerCase() === updateData.nombreTipoDocumento?.toLowerCase()
      )) {
        throw new ConflictException('Ya existe otro tipo de documento con este nombre');
      }
    }

    const updated = {
      ...tipoDocumento,
      ...updateData,
      tipoDocumentoId: id,
      fechaHoraActualizacion: new Date(),
    };

    return this.tipoDocumentoRepository.update(updated);
  }

  async remove(id: number): Promise<void> {
    await this.tipoDocumentoRepository.delete(id);
  }
}
