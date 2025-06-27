import { Proyecto } from "./proyecto.entity";
import { Adjunto } from './adjunto.entity';

export enum EstadoTarea {
  PENDIENTE = 'PENDIENTE',
  EN_PROGRESO = 'EN_PROGRESO',
  COMPLETADA = 'COMPLETADA',
  BLOQUEADA = 'BLOQUEADA',
  ARCHIVADA = 'ARCHIVADA'
}

export class Tarea {
  constructor(
    public tareaId?: number,
    public nombre: string = '',
    public descripcion: string = '',
    public estado: EstadoTarea = EstadoTarea.PENDIENTE,
    public url: string = '',
    public fechaHoraCreacion: Date = new Date(),
    public usuarioCreacion: string = 'SISTEMA',
    public fechaHoraActualizacion?: Date, // Hacer opcional
    public usuarioActualizacion: string = 'SISTEMA',
    public proyectos: Proyecto[] = [],
    public adjuntos: Adjunto[] = []
  ) {}
}
