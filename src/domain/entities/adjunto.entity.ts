export class Adjunto {
  constructor(
    public adjuntoId?: number,
    public nombre: string = '',
    public url: string = '',
    public tipo: string = '',
    public fechaHoraCreacion: Date = new Date(),
    public usuarioCreacion: string = '',
    public fechaHoraActualizacion?: Date,
    public usuarioActualizacion?: string,
    public tareaId?: number
  ) {}
}
