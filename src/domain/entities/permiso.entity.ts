export class Permiso {
  constructor(
    public permisoId?: number,
    public nombre: string = '',
    public descripcion: string = '',
    public estado: 'ACTIVO' | 'INACTIVO' = 'ACTIVO',
    public fechaHoraCreacion: Date = new Date(),
    public usuarioCreacion: string = '',
    public fechaHoraActualizacion?: Date,
    public usuarioActualizacion?: string
  ) {}
}
