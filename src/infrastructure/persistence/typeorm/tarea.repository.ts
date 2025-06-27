import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { TareaEntity } from './tarea.entity';
import { TareaRepository } from '../../../domain/ports/tarea.repository';
import { Tarea } from '../../../domain/entities/tarea.entity';

@Injectable()
export class TypeOrmTareaRepository implements TareaRepository {
  private repository: Repository<TareaEntity>;

  constructor(private dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(TareaEntity);
  }

  async create(tarea: Omit<Tarea, 'tareaId'>): Promise<Tarea> {
    const tareaEntity = new TareaEntity();
    Object.assign(tareaEntity, tarea);
    
    const savedEntity = await this.repository.save(tareaEntity);
    return this.toDomain(savedEntity);
  }

  async findAll(): Promise<Tarea[]> {
    const tareas = await this.repository.find({
      relations: ['proyectos', 'adjuntos']
    });
    return tareas.map(t => this.toDomain(t));
  }

  async findById(id: number): Promise<Tarea | null> {
    const tarea = await this.repository.findOne({
      where: { tareaId: id },
      relations: ['proyectos', 'adjuntos']
    });
    return tarea ? this.toDomain(tarea) : null;
  }

  async update(tarea: Tarea): Promise<Tarea> {
    const tareaEntity = new TareaEntity();
    Object.assign(tareaEntity, tarea);
    
    const updatedEntity = await this.repository.save(tareaEntity);
    return this.toDomain(updatedEntity);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  async addProyectoToTarea(tareaId: number, proyectoId: number): Promise<void> {
    // Implementar la lógica para agregar un proyecto a una tarea
    // Esto podría requerir una consulta más compleja dependiendo de tu modelo de datos
    throw new Error('Method not implemented.');
  }

  private toDomain(tareaEntity: TareaEntity): Tarea {
    const tarea = new Tarea();
    Object.assign(tarea, tareaEntity);
    return tarea;
  }
}
