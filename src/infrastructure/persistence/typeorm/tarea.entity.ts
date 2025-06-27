import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToMany, ManyToOne, JoinColumn, JoinTable } from 'typeorm';
import { Tarea, EstadoTarea } from '../../../domain/entities/tarea.entity';
import { AdjuntoEntity } from './adjunto.entity';
import { ProyectoXTareaEntity } from './proyecto-x-tarea.entity';
import { ProyectoEntity } from './proyecto.entity';

@Entity('tareas')
export class TareaEntity {
  @PrimaryGeneratedColumn({ name: 'tarea_id' })
  tareaId?: number;

  @Column({ length: 256 })
  nombre: string;

  @Column({ type: 'varchar', length: 2000, default: '' })
  descripcion: string;

  @Column({
    type: 'enum',
    enum: EstadoTarea,
    default: EstadoTarea.PENDIENTE
  })
  estado: EstadoTarea;

  @Column({ length: 1024, default: '' })
  url: string = '';

  @CreateDateColumn({ name: 'fecha_hora_creacion' })
  fechaHoraCreacion: Date;

  @Column({ name: 'usuario_creacion', length: 256 })
  usuarioCreacion: string;

  @UpdateDateColumn({ name: 'fecha_hora_actualizacion', nullable: true })
  fechaHoraActualizacion?: Date;

  @Column({ name: 'usuario_actualizacion', length: 256, nullable: true })
  usuarioActualizacion?: string;

  @OneToMany('AdjuntoEntity', 'tarea')
  adjuntos: AdjuntoEntity[];

  // Many-to-many relation with Proyecto
  @ManyToMany(() => ProyectoEntity, proyecto => proyecto.tareas, {
    cascade: true
  })
  @JoinTable({
    name: 'proyecto_x_tarea',
    joinColumn: { name: 'tarea_id', referencedColumnName: 'tareaId' },
    inverseJoinColumn: { name: 'proyecto_id', referencedColumnName: 'proyectoId' }
  })
  proyectos: ProyectoEntity[];

  // Relation with the join table for additional properties
  @OneToMany(() => ProyectoXTareaEntity, proyectoXTarea => proyectoXTarea.tarea, {
    cascade: true
  })
  proyectosXTareas: ProyectoXTareaEntity[];

  toDomain(): Tarea {
    const tarea = new Tarea(
      this.tareaId,
      this.nombre,
      this.descripcion || '',
      this.estado || 'ACTIVO',  // Provide default value here
      this.url || '',
      this.fechaHoraCreacion,
      this.usuarioCreacion,
      this.fechaHoraActualizacion,
      this.usuarioActualizacion
    );

    // Mapear relaciones si existen
    if (this.proyectosXTareas && this.proyectosXTareas.length > 0) {
      tarea.proyectos = this.proyectosXTareas
        .filter(px => px.proyecto)
        .map(px => px.proyecto!.toDomain());
    }

    if (this.adjuntos && this.adjuntos.length > 0) {
      tarea.adjuntos = this.adjuntos.map(adjunto => adjunto.toDomain());
    }

    return tarea;
  }

  static fromDomain(tarea: Tarea): TareaEntity {
    const entity = new TareaEntity();
    entity.tareaId = tarea.tareaId;
    entity.nombre = tarea.nombre;
    entity.descripcion = tarea.descripcion;
    entity.estado = tarea.estado;
    entity.url = tarea.url;
    entity.fechaHoraCreacion = tarea.fechaHoraCreacion;
    entity.usuarioCreacion = tarea.usuarioCreacion;
    entity.fechaHoraActualizacion = tarea.fechaHoraActualizacion;
    entity.usuarioActualizacion = tarea.usuarioActualizacion;
    return entity;
  }
}
