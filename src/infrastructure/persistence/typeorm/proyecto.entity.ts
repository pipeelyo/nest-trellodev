import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable } from 'typeorm';
import { Proyecto } from '../../../domain/entities/proyecto.entity';
import { ProyectoXTareaEntity } from './proyecto-x-tarea.entity';
import { TareaEntity } from './tarea.entity';

@Entity('proyectos')
export class ProyectoEntity implements Proyecto {
  @PrimaryGeneratedColumn({ name: 'proyecto_id' })
  proyectoId?: number;

  @Column({ length: 255 })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ type: 'varchar', length: 50, default: 'ACTIVO' })
  estado: string;

  @CreateDateColumn({ name: 'fecha_hora_creacion', type: 'timestamp' })
  fechaHoraCreacion: Date;

  @Column({ name: 'usuario_creacion', length: 50 })
  usuarioCreacion: string;

  @UpdateDateColumn({ name: 'fecha_hora_actualizacion', type: 'timestamp', nullable: true })
  fechaHoraActualizacion?: Date;

  @Column({ name: 'usuario_actualizacion', length: 50, nullable: true })
  usuarioActualizacion?: string;

  @Column({ name: 'fecha_inicio', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fechaInicio: Date = new Date();

  @Column({ name: 'fecha_fin', type: 'date', nullable: true })
  fechaFin?: Date;

  // Many-to-many relation with Tarea through the join table
  @ManyToMany(() => TareaEntity, tarea => tarea.proyectos)
  @JoinTable({
    name: 'proyecto_x_tarea',
    joinColumn: { name: 'proyecto_id', referencedColumnName: 'proyectoId' },
    inverseJoinColumn: { name: 'tarea_id', referencedColumnName: 'tareaId' }
  })
  tareas: TareaEntity[];

  // Relation with the join table for additional properties
  @OneToMany(() => ProyectoXTareaEntity, proyectoXTarea => proyectoXTarea.proyecto, {
    cascade: true
  })
  tareasXTareas: ProyectoXTareaEntity[];

  toDomain(): Proyecto {
    const proyecto = new Proyecto(
      this.proyectoId,
      this.nombre,
      this.descripcion || '',
      this.estado || 'ACTIVO',  // Provide default value here
      this.fechaHoraCreacion,
      this.usuarioCreacion,
      this.fechaHoraActualizacion,
      this.usuarioActualizacion,
      this.tareas?.map(tarea => tarea.toDomain()) || []
    );
    return proyecto;
  }

  static fromDomain(proyecto: Proyecto): ProyectoEntity {
    const entity = new ProyectoEntity();
    entity.proyectoId = proyecto.proyectoId;
    entity.nombre = proyecto.nombre;
    entity.descripcion = proyecto.descripcion;
    entity.estado = proyecto.estado;
    entity.fechaHoraCreacion = proyecto.fechaHoraCreacion;
    entity.usuarioCreacion = proyecto.usuarioCreacion;
    entity.fechaHoraActualizacion = proyecto.fechaHoraActualizacion;
    entity.usuarioActualizacion = proyecto.usuarioActualizacion;
    // Note: tareas relationship should be handled separately if needed
    return entity;
  }
}
