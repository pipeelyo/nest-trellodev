import { Tarea } from './tarea.entity';

export class Proyecto {
  constructor(
    public proyectoId?: number,
    public nombre: string = '',
    public descripcion: string = '',
    public estado: string  = 'ACTIVO',
    public fechaHoraCreacion: Date = new Date(),
    public usuarioCreacion: string = '',
    public fechaHoraActualizacion?: Date,
    public usuarioActualizacion?: string,
    public tareas: Tarea[] = [],
    public fechaInicio: Date = new Date(),
    public fechaFin?: Date
  ) {}
}
