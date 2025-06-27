import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Relation } from 'typeorm';
import { Adjunto } from '../../../domain/entities/adjunto.entity';

@Entity('adjuntos')
export class AdjuntoEntity {
  @PrimaryGeneratedColumn({ name: 'adjunto_id' })
  adjuntoId?: number;

  @Column({ name: 'nombre' })
  nombre: string;

  @Column({ name: 'url' })
  url: string;

  @Column({ name: 'tipo' })
  tipo: string;

  @CreateDateColumn({ name: 'fecha_hora_creacion' })
  fechaHoraCreacion: Date;

  @Column({ name: 'usuario_creacion' })
  usuarioCreacion: string;

  @UpdateDateColumn({ name: 'fecha_hora_actualizacion', nullable: true })
  fechaHoraActualizacion?: Date;

  @Column({ name: 'usuario_actualizacion', nullable: true })
  usuarioActualizacion?: string;

  @Column({ name: 'tarea_id' })
  tareaId: number;

  toDomain(): Adjunto {
    return new Adjunto(
      this.adjuntoId,
      this.nombre,
      this.url,
      this.tipo,
      this.fechaHoraCreacion,
      this.usuarioCreacion,
      this.fechaHoraActualizacion,
      this.usuarioActualizacion,
      this.tareaId
    );
  }

  @ManyToOne('TareaEntity', 'adjuntos')
  @JoinColumn({ name: 'tarea_id' })
  tarea: any;
}
