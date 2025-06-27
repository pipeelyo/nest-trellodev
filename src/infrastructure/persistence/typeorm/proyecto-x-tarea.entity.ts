import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ProyectoEntity } from './proyecto.entity';
import { TareaEntity } from './tarea.entity';

@Entity('proyecto_x_tarea')
export class ProyectoXTareaEntity {
  @PrimaryColumn({ name: 'proyecto_id' })
  proyectoId: number;

  @PrimaryColumn({ name: 'tarea_id' })
  tareaId: number;

  @Column({ type: 'varchar', length: 50, default: 'ACTIVO' })
  estado: 'ACTIVO' | 'INACTIVO';

  @Column({ name: 'fecha_hora_creacion', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fechaHoraCreacion: Date;

  @Column({ name: 'usuario_creacion', length: 50 })
  usuarioCreacion: string;

  @Column({ name: 'fecha_hora_actualizacion', type: 'timestamp', nullable: true })
  fechaHoraActualizacion?: Date;

  @Column({ name: 'usuario_actualizacion', length: 50, nullable: true })
  usuarioActualizacion?: string;

  // Relaciones
  @ManyToOne(() => ProyectoEntity, proyecto => proyecto.tareas, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'proyecto_id' })
  proyecto: ProyectoEntity;

  @ManyToOne(() => TareaEntity, tarea => tarea.proyectosXTareas, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tarea_id' })
  tarea: TareaEntity;
}
