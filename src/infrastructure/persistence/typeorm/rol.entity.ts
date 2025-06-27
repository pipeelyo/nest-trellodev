import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Rol } from '../../../domain/entities/rol.entity';
import { AreaEntity } from './area.entity';
import { PermisoXRolEntity } from './permiso-x-rol.entity';
import { RolXUsuarioEntity } from './rol-x-usuario.entity';

@Entity('roles')
export class RolEntity {
  @PrimaryGeneratedColumn({ name: 'role_id' })
  roleId?: number;

  @Column({ length: 256 })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion?: string;

  @Column({ name: 'fk_area_id' })
  areaId: number;

  @ManyToOne(() => AreaEntity, area => area.roles)
  @JoinColumn({ name: 'fk_area_id' })
  area?: AreaEntity;

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

  @OneToMany(() => PermisoXRolEntity, permisoRol => permisoRol.rol)
  permisosXRoles?: PermisoXRolEntity[];

  @OneToMany(() => RolXUsuarioEntity, rolUsuario => rolUsuario.rol)
  rolesXUsuarios?: RolXUsuarioEntity[];

  toDomain(): Rol {
    const rol = new Rol(
      this.roleId,
      this.nombre,
      this.descripcion || '',
      this.areaId,
      this.area?.toDomain(),
      this.estado,
      this.fechaHoraCreacion,
      this.usuarioCreacion,
      this.fechaHoraActualizacion,
      this.usuarioActualizacion
    );

    // Mapear permisos si existen
    if (this.permisosXRoles && this.permisosXRoles.length > 0) {
      rol.permisos = this.permisosXRoles
        .filter(pr => pr.permiso)
        .map(pr => pr.permiso!.toDomain());
    }

    return rol;
  }

  static fromDomain(rol: Rol): RolEntity {
    const entity = new RolEntity();
    entity.roleId = rol.roleId;
    entity.nombre = rol.nombre;
    entity.descripcion = rol.descripcion;
    entity.areaId = rol.areaId;
    entity.estado = rol.estado;
    entity.fechaHoraCreacion = rol.fechaHoraCreacion;
    entity.usuarioCreacion = rol.usuarioCreacion;
    entity.fechaHoraActualizacion = rol.fechaHoraActualizacion;
    entity.usuarioActualizacion = rol.usuarioActualizacion;
    return entity;
  }
}
