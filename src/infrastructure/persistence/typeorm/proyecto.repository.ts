import { DataSource, Repository } from 'typeorm';
import { Proyecto } from '../../../domain/entities/proyecto.entity';
import { ProyectoRepository } from '../../../domain/ports/proyecto.repository';
import { ProyectoEntity } from './proyecto.entity';
import { ProyectoXTareaEntity } from './proyecto-x-tarea.entity';

export class TypeOrmProyectoRepository implements ProyectoRepository {
  private repository: Repository<ProyectoEntity>;
  private proyectoXTareaRepository: Repository<ProyectoXTareaEntity>;

  constructor(private dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(ProyectoEntity);
    this.proyectoXTareaRepository = this.dataSource.getRepository(ProyectoXTareaEntity);
  }

  private toDomain(entity: ProyectoEntity): Proyecto {
    return {
      proyectoId: entity.proyectoId,
      nombre: entity.nombre,
      descripcion: entity.descripcion || '',
      fechaHoraCreacion: entity.fechaHoraCreacion,
      usuarioCreacion: entity.usuarioCreacion,
      fechaHoraActualizacion: entity.fechaHoraActualizacion,
      usuarioActualizacion: entity.usuarioActualizacion,
      estado: entity.estado,
      fechaInicio: entity.fechaInicio,
      fechaFin: entity.fechaFin,
      tareas: entity.tareas?.map(tareaEntity => ({
        tareaId: tareaEntity.tareaId,
        nombre: tareaEntity.nombre,
        descripcion: tareaEntity.descripcion || '',
        estado: tareaEntity.estado || 'ACTIVO',
        url: tareaEntity.url || '',
        fechaHoraCreacion: tareaEntity.fechaHoraCreacion,
        usuarioCreacion: tareaEntity.usuarioCreacion,
        fechaHoraActualizacion: tareaEntity.fechaHoraActualizacion,
        usuarioActualizacion: tareaEntity.usuarioActualizacion,
        proyectos: [],
        adjuntos: []
      })) || [],
    };
  }

  async findById(id: number): Promise<Proyecto | null> {
    const proyecto = await this.repository.findOne({
      where: { proyectoId: id },
      relations: ['tareas'],
    });
    return proyecto ? this.toDomain(proyecto) : null;
  }

  async save(proyecto: Omit<Proyecto, 'proyectoId'>): Promise<Proyecto> {
    // Create a new entity with explicit field mapping to ensure no NULL values for required fields
    const proyectoEntity = this.repository.create({
      nombre: proyecto.nombre,
      descripcion: proyecto.descripcion || '',
      estado: proyecto.estado || 'ACTIVO',
      fechaHoraCreacion: proyecto.fechaHoraCreacion || new Date(),
      usuarioCreacion: proyecto.usuarioCreacion || 'system',
      fechaHoraActualizacion: proyecto.fechaHoraActualizacion,
      usuarioActualizacion: proyecto.usuarioActualizacion,
      fechaInicio: proyecto.fechaInicio || new Date(),
      fechaFin: proyecto.fechaFin,
    });
    
    // Save the proyecto
    const savedProyecto = await this.repository.save(proyectoEntity);
    
    // If there are tareas to associate, add them
    if (proyecto.tareas && proyecto.tareas.length > 0) {
      await this.addTareasToProyecto(savedProyecto.proyectoId!, proyecto.tareas.map(t => t.tareaId!));
      // Reload the proyecto with tareas
      const reloaded = await this.findById(savedProyecto.proyectoId!);
      return reloaded!;
    }
    
    return this.toDomain(savedProyecto);
  }
  
  private async addTareasToProyecto(proyectoId: number, tareaIds: number[]): Promise<void> {
    await Promise.all(
      tareaIds.map(tareaId =>
        this.proyectoXTareaRepository.save({
          proyectoId,
          tareaId,
          estado: 'ACTIVO',
          fechaHoraCreacion: new Date(),
          usuarioCreacion: 'system',
        })
      )
    );
  }

  async update(proyecto: Proyecto): Promise<Proyecto> {
    if (!proyecto.proyectoId) {
      throw new Error('ID de proyecto es requerido para actualizar');
    }

    // Get existing proyecto with relations
    const existing = await this.repository.findOne({
      where: { proyectoId: proyecto.proyectoId },
      relations: ['tareas'],
    });

    if (!existing) {
      throw new Error('Proyecto no encontrado');
    }

    // Update the entity with new values
    const updatedEntity = {
      ...existing,
      nombre: proyecto.nombre,
      descripcion: proyecto.descripcion || '',
      estado: proyecto.estado,
      fechaHoraActualizacion: new Date(),
      usuarioActualizacion: proyecto.usuarioActualizacion || 'system',
      fechaInicio: proyecto.fechaInicio || new Date(),
      fechaFin: proyecto.fechaFin,
    };

    // Save the updated entity
    const updated = await this.repository.save(updatedEntity);

    // Handle tareas update if needed
    if (proyecto.tareas) {
      // Remove existing tareas
      await this.proyectoXTareaRepository.delete({ proyectoId: proyecto.proyectoId });
      
      // Add new tareas
      if (proyecto.tareas.length > 0) {
        await this.addTareasToProyecto(
          proyecto.proyectoId,
          proyecto.tareas.map(t => t.tareaId!)
        );
      }
      
      // Reload the proyecto with updated tareas
      return this.findById(proyecto.proyectoId) as Promise<Proyecto>;
    }

    return this.toDomain(updated);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  async findAll(): Promise<Proyecto[]> {
    const proyectos = await this.repository.find({
      relations: ['tareas'],
    });
    return proyectos.map(proyecto => this.toDomain(proyecto));
  }

  async addTareaToProyecto(proyectoId: number, tareaId: number): Promise<void> {
    const exists = await this.proyectoXTareaRepository.findOne({
      where: { proyectoId, tareaId },
    });

    if (!exists) {
      const proyectoXTarea = this.proyectoXTareaRepository.create({
        proyectoId,
        tareaId,
        estado: 'ACTIVO',
        fechaHoraCreacion: new Date(),
        usuarioCreacion: 'system',
      });
      await this.proyectoXTareaRepository.save(proyectoXTarea);
    }
  }

  async removeTareaFromProyecto(proyectoId: number, tareaId: number): Promise<void> {
    await this.proyectoXTareaRepository.delete({
      proyectoId,
      tareaId,
    });
  }
}
