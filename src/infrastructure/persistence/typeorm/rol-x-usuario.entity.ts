import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { RolXUsuario } from '../../../domain/entities/rol-x-usuario.entity';
import { RolEntity } from './rol.entity';
import { UserEntity } from './user.entity';

@Entity('rolexusuario')
export class RolXUsuarioEntity {
  @PrimaryGeneratedColumn({ name: 'rolexusuario_id' })
  rolXUsuarioId?: number;

  @Column({ name: 'fk_role_id' })
  roleId: number;

  @Column({ name: 'fk_usuario_id' })
  usuarioId: number;

  @ManyToOne(() => RolEntity, { eager: true })
  @JoinColumn({ name: 'fk_role_id' })
  rol?: RolEntity;

  @ManyToOne(() => UserEntity, user => user.rolesXUsuarios)
  @JoinColumn({ name: 'fk_usuario_id' })
  usuario?: UserEntity;

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

  toDomain(): RolXUsuario {
    return new RolXUsuario(
      this.rolXUsuarioId,
      this.roleId,
      this.usuarioId,
      this.estado,
      this.fechaHoraCreacion,
      this.usuarioCreacion,
      this.fechaHoraActualizacion,
      this.usuarioActualizacion
    );
  }

  static fromDomain(rolXUsuario: RolXUsuario): RolXUsuarioEntity {
    const entity = new RolXUsuarioEntity();
    entity.rolXUsuarioId = rolXUsuario.rolXUsuarioId;
    entity.roleId = rolXUsuario.roleId;
    entity.usuarioId = rolXUsuario.usuarioId;
    entity.estado = rolXUsuario.estado;
    entity.fechaHoraCreacion = rolXUsuario.fechaHoraCreacion;
    entity.usuarioCreacion = rolXUsuario.usuarioCreacion;
    entity.fechaHoraActualizacion = rolXUsuario.fechaHoraActualizacion;
    entity.usuarioActualizacion = rolXUsuario.usuarioActualizacion;
    return entity;
  }
}
