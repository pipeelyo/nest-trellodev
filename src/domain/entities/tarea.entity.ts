import { Proyecto } from "./proyecto.entity";
import { Adjunto } from './adjunto.entity';

export class Tarea {
  constructor(
    public tareaId?: number,
    public nombre: string = '',
    public descripcion: string = '',
    public estado: string = 'ACTIVO',
    public url: string = '',
    public fechaHoraCreacion: Date = new Date(),
    public usuarioCreacion: string = '',
    public fechaHoraActualizacion?: Date,
    public usuarioActualizacion?: string,
    public proyectos: Proyecto[] = [],
    public adjuntos: Adjunto[] = []
  ) {}
}
