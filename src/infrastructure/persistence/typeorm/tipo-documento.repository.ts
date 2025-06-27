import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { TipoDocumentoEntity } from './tipo-documento.entity';
import { TipoDocumentoRepository } from '../../../domain/ports/tipo-documento.repository';
import { TipoDocumento } from '../../../domain/entities/tipo-documento.entity';

@Injectable()
export class TypeOrmTipoDocumentoRepository implements TipoDocumentoRepository {
  constructor(private readonly dataSource: DataSource) {}

  async findAll(): Promise<TipoDocumento[]> {
    const tipos = await this.dataSource
      .getRepository(TipoDocumentoEntity)
      .find({ where: { estado: 'ACTIVO' } });
    return tipos.map(tipo => tipo.toDomain());
  }

  async findById(id: number): Promise<TipoDocumento | null> {
    const tipo = await this.dataSource
      .getRepository(TipoDocumentoEntity)
      .findOne({ where: { tipoDocumentoId: id } });
    return tipo ? tipo.toDomain() : null;
  }

  async save(tipoDocumento: TipoDocumento): Promise<TipoDocumento> {
    const tipoEntity = TipoDocumentoEntity.fromDomain(tipoDocumento);
    const savedEntity = await this.dataSource
      .getRepository(TipoDocumentoEntity)
      .save(tipoEntity);
    return savedEntity.toDomain();
  }

  async update(tipoDocumento: TipoDocumento): Promise<TipoDocumento> {
    return this.save(tipoDocumento); // save() de TypeORM maneja tanto insert como update
  }

  async delete(id: number): Promise<void> {
    await this.dataSource
      .getRepository(TipoDocumentoEntity)
      .update(id, { estado: 'INACTIVO' });
  }
}
