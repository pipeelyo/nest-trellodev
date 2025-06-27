import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { TipoDocumento } from '../../../domain/entities/tipo-documento.entity';

@Entity('tipo_documento')
export class TipoDocumentoEntity {
  @PrimaryGeneratedColumn({ name: 'tipo_documento_id' })
  tipoDocumentoId?: number;

  @Column({ name: 'nombre_tipo_documento', length: 256 })
  nombreTipoDocumento: string;

  @Column({ type: 'enum', enum: ['ACTIVO', 'INACTIVO'], default: 'ACTIVO' })
  estado: 'ACTIVO' | 'INACTIVO';

  @CreateDateColumn({ name: 'fecha_hora_creacion' })
  fechaHoraCreacion: Date;

  @Column({ name: 'usuario_creacion', length: 256 })
  usuarioCreacion: string;

  @UpdateDateColumn({ name: 'fecha_hora_actualizacion', nullable: true })
  fechaHoraActualizacion?: Date;

  @Column({ name: 'usuario_actualizacion', length: 256, nullable: true })
  usuarioActualizacion?: string;

  toDomain(): TipoDocumento {
    return new TipoDocumento(
      this.tipoDocumentoId,
      this.nombreTipoDocumento,
      this.estado,
      this.fechaHoraCreacion,
      this.usuarioCreacion,
      this.fechaHoraActualizacion,
      this.usuarioActualizacion
    );
  }

  static fromDomain(tipoDocumento: TipoDocumento): TipoDocumentoEntity {
    const entity = new TipoDocumentoEntity();
    entity.tipoDocumentoId = tipoDocumento.tipoDocumentoId;
    entity.nombreTipoDocumento = tipoDocumento.nombreTipoDocumento;
    entity.estado = tipoDocumento.estado;
    entity.fechaHoraCreacion = tipoDocumento.fechaHoraCreacion;
    entity.usuarioCreacion = tipoDocumento.usuarioCreacion;
    entity.fechaHoraActualizacion = tipoDocumento.fechaHoraActualizacion;
    entity.usuarioActualizacion = tipoDocumento.usuarioActualizacion;
    return entity;
  }
}
