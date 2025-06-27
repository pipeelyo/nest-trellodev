import { UserRepository } from '../../domain/ports/user.repository';
import { User } from '../../domain/entities/user.entity';

export class CreateUserUseCase {
    constructor(private readonly userRepository: UserRepository) {}

    async execute(user: User): Promise<User> {
        // Validaciones de negocio
        if (!user.correoElectronico) {
            throw new Error('El correo electrónico es requerido');
        }

        // Verificar si el email ya existe
        const existingUser = await this.userRepository.findByEmail(user.correoElectronico);
        if (existingUser) {
            throw new Error('El email ya está registrado');
        }

        // Crear usuario
        return this.userRepository.save(user);
    }
}
