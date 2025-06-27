import { Injectable, ConflictException, NotFoundException, Inject } from '@nestjs/common';
import { Tarea } from '../../domain/entities/tarea.entity';
import { TareaRepository } from '../../domain/ports/tarea.repository';

@Injectable()
export class TareaService {
  constructor(
    private readonly tareaRepository: TareaRepository
  ) {}

  async create(createTareaDto: Omit<Tarea, 'tareaId' | 'fechaHoraCreacion' | 'fechaHoraActualizacion' | 'proyectos' | 'adjuntos'>): Promise<Tarea> {
    // Verificar si ya existe una tarea con el mismo nombre (opcional)
    const tareas = await this.tareaRepository.findAll();
    if (tareas.some(t => t.nombre.toLowerCase() === createTareaDto.nombre.toLowerCase())) {
      throw new ConflictException('Ya existe una tarea con este nombre');
    }

    const nuevaTarea: Omit<Tarea, 'tareaId'> = {
      ...createTareaDto,
      fechaHoraCreacion: new Date(),
      proyectos: [],
      adjuntos: []
    };

    return this.tareaRepository.create(nuevaTarea);
  }

  async findAll(): Promise<Tarea[]> {
    return this.tareaRepository.findAll();
  }

  async findById(id: number): Promise<Tarea> {
    const tarea = await this.tareaRepository.findById(id);
    if (!tarea) {
      throw new NotFoundException(`Tarea con ID ${id} no encontrada`);
    }
    return tarea;
  }

  async update(id: number, updateTareaDto: Partial<Tarea> & { 
    usuarioActualizacion?: string;
    proyectoId?: number; // ID del proyecto al que se quiere asociar la tarea
  }): Promise<Tarea> {
    // Verificar si la tarea existe
    const existingTarea = await this.findById(id);
    
    // Extraer el ID del proyecto si se proporciona
    const { proyectoId, ...tareaUpdate } = updateTareaDto;
    
    // Obtener el usuario que está realizando la actualización
    const usuarioActualizacion = updateTareaDto.usuarioActualizacion || existingTarea.usuarioActualizacion || 'SISTEMA';
    
    // Actualizar solo los campos proporcionados
    const updatedTarea = {
      ...existingTarea,
      ...tareaUpdate,
      tareaId: id, // Asegurarse de que el ID se mantenga
      fechaHoraActualizacion: new Date(),
      usuarioActualizacion // Incluir el usuario que actualiza
    };

    // Manejar la actualización del proyecto si se proporciona
    if (proyectoId !== undefined) {
      // Usar el método existente para asociar la tarea al proyecto
      await this.tareaRepository.addProyectoToTarea(id, proyectoId);
    }

    // Actualizar la tarea
    return this.tareaRepository.update(updatedTarea);
  }
}
