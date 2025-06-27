import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { User } from '../../../domain/entities/user.entity';
import { RolXUsuarioEntity } from './rol-x-usuario.entity';

@Entity('usuarios')
export class UserEntity {
    @PrimaryGeneratedColumn({ name: 'usuario_id' })
    usuarioId?: number;

    @Column({ name: 'primer_nombre', length: 256 })
    primerNombre: string;

    @Column({ name: 'segundo_nombre', length: 256, nullable: true })
    segundoNombre: string;

    @Column({ name: 'primer_apellido', length: 256 })
    primerApellido: string;

    @Column({ name: 'segundo_apellido', length: 256, nullable: true })
    segundoApellido: string;

    @Column({ name: 'fk_tipo_documento_id' })
    tipoDocumentoId: number;

    @Column({ name: 'numero_documento', length: 30 })
    numeroDocumento: string;

    @Column({ name: 'correo_electronico', length: 1024 })
    correoElectronico: string;

    @Column({ name: 'contrasena', length: 256, select: false })
    contrasena: string;

    @Column({ length: 20 })
    telefono: string;

    @Column({ type: 'enum', enum: ['ACTIVO', 'INACTIVO'], default: 'ACTIVO' })
    estado: 'ACTIVO' | 'INACTIVO';

    @CreateDateColumn({ name: 'fecha_hora_creacion' })
    fechaHoraCreacion: Date;

    @Column({ name: 'usuario_creacion', length: 256 })
    usuarioCreacion: string;

    @UpdateDateColumn({ name: 'fecha_hora_actualizacion', nullable: true })
    fechaHoraActualizacion?: Date;

    @Column({ name: 'usuario_actualizacion', length: 256, nullable: true })
    usuarioActualizacion?: string;

    @OneToMany(() => RolXUsuarioEntity, rolUsuario => rolUsuario.usuario)
    rolesXUsuarios?: RolXUsuarioEntity[];

    toDomain(): User {
        return new User(
            this.usuarioId,
            this.primerNombre,
            this.segundoNombre || '',
            this.primerApellido,
            this.segundoApellido || '',
            this.tipoDocumentoId,
            this.numeroDocumento,
            this.correoElectronico,
            this.contrasena,
            this.telefono,
            this.estado,
            this.fechaHoraCreacion,
            this.usuarioCreacion,
            this.fechaHoraActualizacion,
            this.usuarioActualizacion
        );
    }

    static fromDomain(user: User): UserEntity {
        const entity = new UserEntity();
        entity.usuarioId = user.usuarioId;
        entity.primerNombre = user.primerNombre;
        entity.segundoNombre = user.segundoNombre;
        entity.primerApellido = user.primerApellido;
        entity.segundoApellido = user.segundoApellido;
        entity.tipoDocumentoId = user.tipoDocumentoId;
        entity.numeroDocumento = user.numeroDocumento;
        entity.correoElectronico = user.correoElectronico;
        entity.contrasena = user.contrasena;
        entity.telefono = user.telefono;
        entity.estado = user.estado;
        entity.fechaHoraCreacion = user.fechaHoraCreacion;
        entity.usuarioCreacion = user.usuarioCreacion;
        entity.fechaHoraActualizacion = user.fechaHoraActualizacion;
        entity.usuarioActualizacion = user.usuarioActualizacion;
        return entity;
    }
}
