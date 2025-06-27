import { Area } from './area.entity';
import { Permiso } from './permiso.entity';

export class Rol {
  constructor(
    public roleId?: number,
    public nombre: string = '',
    public descripcion: string = '',
    public areaId: number = 0,
    public area?: Area,
    public estado: 'ACTIVO' | 'INACTIVO' = 'ACTIVO',
    public fechaHoraCreacion: Date = new Date(),
    public usuarioCreacion: string = '',
    public fechaHoraActualizacion?: Date,
    public usuarioActualizacion?: string,
    public permisos: Permiso[] = []
  ) {}
}
