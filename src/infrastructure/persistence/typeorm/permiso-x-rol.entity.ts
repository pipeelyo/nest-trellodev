import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { PermisoXRol } from '../../../domain/entities/permiso-x-rol.entity';
import { PermisoEntity } from './permiso.entity';
import { RolEntity } from './rol.entity';

@Entity('permisos_x_role')
export class PermisoXRolEntity {
  @PrimaryGeneratedColumn({ name: 'permisos_x_role_id' })
  permisosXRolId?: number;

  @Column({ name: 'fk_permiso_id', nullable: true })
  permisoId?: number;

  @Column({ name: 'fk_role_id', nullable: true })
  roleId?: number;

  @ManyToOne(() => PermisoEntity, { eager: true })
  @JoinColumn({ name: 'fk_permiso_id' })
  permiso?: PermisoEntity;

  @ManyToOne(() => RolEntity, rol => rol.permisosXRoles)
  @JoinColumn({ name: 'fk_role_id' })
  rol?: RolEntity;

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

  toDomain(): PermisoXRol {
    return new PermisoXRol(
      this.permisosXRolId,
      this.permisoId || 0,
      this.roleId || 0,
      this.estado,
      this.fechaHoraCreacion,
      this.usuarioCreacion,
      this.fechaHoraActualizacion,
      this.usuarioActualizacion
    );
  }

  static fromDomain(permisoXRol: PermisoXRol): PermisoXRolEntity {
    const entity = new PermisoXRolEntity();
    entity.permisosXRolId = permisoXRol.permisosXRolId;
    entity.permisoId = permisoXRol.permisoId;
    entity.roleId = permisoXRol.roleId;
    entity.estado = permisoXRol.estado;
    entity.fechaHoraCreacion = permisoXRol.fechaHoraCreacion;
    entity.usuarioCreacion = permisoXRol.usuarioCreacion;
    entity.fechaHoraActualizacion = permisoXRol.fechaHoraActualizacion;
    entity.usuarioActualizacion = permisoXRol.usuarioActualizacion;
    return entity;
  }
}
