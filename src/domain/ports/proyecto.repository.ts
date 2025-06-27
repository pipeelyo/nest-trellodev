import { Proyecto } from '../entities/proyecto.entity';

export const PROYECTO_REPOSITORY = 'PROYECTO_REPOSITORY';

export interface ProyectoRepository {
  findById(id: number): Promise<Proyecto | null>;
  save(proyecto: Omit<Proyecto, 'proyectoId'>): Promise<Proyecto>;
  update(proyecto: Proyecto): Promise<Proyecto>;
  delete(id: number): Promise<void>;
  findAll(): Promise<Proyecto[]>;
  addTareaToProyecto(proyectoId: number, tareaId: number): Promise<void>;
  removeTareaFromProyecto(proyectoId: number, tareaId: number): Promise<void>;
}
