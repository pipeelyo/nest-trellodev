export class PermisoXRol {
  constructor(
    public permisosXRolId?: number,
    public permisoId: number = 0,
    public roleId: number = 0,
    public estado: 'ACTIVO' | 'INACTIVO' = 'ACTIVO',
    public fechaHoraCreacion: Date = new Date(),
    public usuarioCreacion: string = '',
    public fechaHoraActualizacion?: Date,
    public usuarioActualizacion?: string
  ) {}
}
