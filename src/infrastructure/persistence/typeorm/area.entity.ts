import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Area } from '../../../domain/entities/area.entity';
import { RolEntity } from './rol.entity';

@Entity('areas')
export class AreaEntity {
  @PrimaryGeneratedColumn({ name: 'area_id' })
  areaId?: number;

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

  @OneToMany(() => RolEntity, rol => rol.area)
  roles?: RolEntity[];

  toDomain(): Area {
    return new Area(
      this.areaId,
      this.nombre,
      this.descripcion || '',
      this.estado,
      this.fechaHoraCreacion,
      this.usuarioCreacion,
      this.fechaHoraActualizacion,
      this.usuarioActualizacion
    );
  }

  static fromDomain(area: Area): AreaEntity {
    const entity = new AreaEntity();
    entity.areaId = area.areaId;
    entity.nombre = area.nombre;
    entity.descripcion = area.descripcion;
    entity.estado = area.estado;
    entity.fechaHoraCreacion = area.fechaHoraCreacion;
    entity.usuarioCreacion = area.usuarioCreacion;
    entity.fechaHoraActualizacion = area.fechaHoraActualizacion;
    entity.usuarioActualizacion = area.usuarioActualizacion;
    return entity;
  }
}
