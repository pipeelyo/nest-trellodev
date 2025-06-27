import { Injectable, NotFoundException, ConflictException, Inject } from '@nestjs/common';
import { Proyecto } from '../../domain/entities/proyecto.entity';
import { PROYECTO_REPOSITORY, ProyectoRepository } from '../../domain/ports/proyecto.repository';

export const PROYECTO_SERVICE = 'PROYECTO_SERVICE';

export interface ProyectoService {
  create(proyecto: Omit<Proyecto, 'proyectoId'>): Promise<Proyecto>;
  findAll(): Promise<Proyecto[]>;
  findById(id: number): Promise<Proyecto>;
  update(id: number, proyecto: Partial<Proyecto>): Promise<Proyecto>;
  delete(id: number): Promise<void>;
}

@Injectable()
export class ProyectoServiceImpl implements ProyectoService {
  constructor(
    @Inject(PROYECTO_REPOSITORY)
    private readonly proyectoRepository: ProyectoRepository
  ) {}

  async create(proyectoData: Omit<Proyecto, 'proyectoId'>): Promise<Proyecto> {
    // Verificar si ya existe un proyecto con el mismo nombre
    const existingProyecto = await this.proyectoRepository.findAll();
    if (existingProyecto.some(p => p.nombre.toLowerCase() === proyectoData.nombre.toLowerCase())) {
      throw new ConflictException('Ya existe un proyecto con este nombre');
    }

    const proyecto: Omit<Proyecto, 'proyectoId'> = {
      ...proyectoData,
      fechaHoraCreacion: new Date(),
      tareas: [],
    };

    return this.proyectoRepository.save(proyecto);
  }

  async findAll(): Promise<Proyecto[]> {
    return this.proyectoRepository.findAll();
  }

  async findById(id: number): Promise<Proyecto> {
    const proyecto = await this.proyectoRepository.findById(id);
    if (!proyecto) {
      throw new NotFoundException(`Proyecto con ID ${id} no encontrado`);
    }
    return proyecto;
  }

  async update(id: number, updateData: Partial<Proyecto>): Promise<Proyecto> {
    const proyecto = await this.findById(id);
    
    // Verificar si se está intentando cambiar el nombre a uno que ya existe
    if (updateData.nombre !== undefined && updateData.nombre !== proyecto.nombre) {
      const existingProyectos = await this.proyectoRepository.findAll();
      if (existingProyectos.some(p => 
        p.proyectoId !== id && 
        p.nombre.toLowerCase() === updateData.nombre!.toLowerCase()
      )) {
        throw new ConflictException('Ya existe un proyecto con este nombre');
      }
    }

    const proyectoActualizado = {
      ...proyecto,
      ...updateData,
      proyectoId: id,
      fechaHoraActualizacion: new Date(),
    };

    return this.proyectoRepository.update(proyectoActualizado);
  }

  async delete(id: number): Promise<void> {
    // Verificar que el proyecto existe
    await this.findById(id);
    return this.proyectoRepository.delete(id);
  }
}
