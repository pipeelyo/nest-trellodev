export class User {
  constructor(
    public usuarioId?: number,
    public primerNombre: string = '',
    public segundoNombre: string = '',
    public primerApellido: string = '',
    public segundoApellido: string = '',
    public tipoDocumentoId: number = 0,
    public numeroDocumento: string = '',
    public correoElectronico: string = '',
    public contrasena: string = '',
    public telefono: string = '',
    public estado: 'ACTIVO' | 'INACTIVO' = 'ACTIVO',
    public fechaHoraCreacion: Date = new Date(),
    public usuarioCreacion: string = '',
    public fechaHoraActualizacion?: Date,
    public usuarioActualizacion?: string
  ) {}

  // Reglas de negocio
  validatePassword(password: string): boolean {
    // Implementar lógica de validación de contraseña
    return false; // Implementar lógica real
  }

  get nombreCompleto(): string {
    return `${this.primerNombre} ${this.segundoNombre} ${this.primerApellido} ${this.segundoApellido}`.replace(/\s+/g, ' ').trim();
  }
}
