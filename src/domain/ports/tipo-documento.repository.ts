import { TipoDocumento } from '../entities/tipo-documento.entity';

export interface TipoDocumentoRepository {
  findAll(): Promise<TipoDocumento[]>;
  findById(id: number): Promise<TipoDocumento | null>;
  save(tipoDocumento: TipoDocumento): Promise<TipoDocumento>;
  update(tipoDocumento: TipoDocumento): Promise<TipoDocumento>;
  delete(id: number): Promise<void>;
}
