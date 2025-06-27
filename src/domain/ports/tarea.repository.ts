import { Tarea } from '../entities/tarea.entity';

export interface TareaRepository {
  create(tarea: Omit<Tarea, 'tareaId'>): Promise<Tarea>;
  findAll(): Promise<Tarea[]>;
  findById(id: number): Promise<Tarea | null>;
  update(tarea: Tarea): Promise<Tarea>;
  delete(id: number): Promise<void>;
  addProyectoToTarea(tareaId: number, proyectoId: number): Promise<void>;
}
