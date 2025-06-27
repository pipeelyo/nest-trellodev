import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Permiso } from '../../../domain/entities/permiso.entity';

@Entity('permisos')
export class PermisoEntity {
  @PrimaryGeneratedColumn({ name: 'permiso_id' })
  permisoId?: number;

  @Column({ length: 256 })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion?: string;

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

  @OneToMany('PermisoXRolEntity', 'permiso')
  permisosXRoles?: any[];

  toDomain(): Permiso {
    return new Permiso(
      this.permisoId,
      this.nombre,
      this.descripcion || '',
      this.estado,
      this.fechaHoraCreacion,
      this.usuarioCreacion,
      this.fechaHoraActualizacion,
      this.usuarioActualizacion
    );
  }

  static fromDomain(permiso: Permiso): PermisoEntity {
    const entity = new PermisoEntity();
    entity.permisoId = permiso.permisoId;
    entity.nombre = permiso.nombre;
    entity.descripcion = permiso.descripcion;
    entity.estado = permiso.estado;
    entity.fechaHoraCreacion = permiso.fechaHoraCreacion;
    entity.usuarioCreacion = permiso.usuarioCreacion;
    entity.fechaHoraActualizacion = permiso.fechaHoraActualizacion;
    entity.usuarioActualizacion = permiso.usuarioActualizacion;
    return entity;
  }
}
