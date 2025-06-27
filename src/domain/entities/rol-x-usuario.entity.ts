export class RolXUsuario {
  constructor(
    public rolXUsuarioId?: number,
    public roleId: number = 0,
    public usuarioId: number = 0,
    public estado: 'ACTIVO' | 'INACTIVO' = 'ACTIVO',
    public fechaHoraCreacion: Date = new Date(),
    public usuarioCreacion: string = '',
    public fechaHoraActualizacion?: Date,
    public usuarioActualizacion?: string
  ) {}
}
