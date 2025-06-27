export class TipoDocumento {
  constructor(
    public tipoDocumentoId?: number,
    public nombreTipoDocumento: string = '',
    public estado: 'ACTIVO' | 'INACTIVO' = 'ACTIVO',
    public fechaHoraCreacion: Date = new Date(),
    public usuarioCreacion: string = '',
    public fechaHoraActualizacion?: Date,
    public usuarioActualizacion?: string
  ) {}

  // Métodos de negocio pueden ir aquí
}
