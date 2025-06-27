import { DataSource } from 'typeorm';
import { UserEntity } from './user.entity';
import { UserRepository } from '../../../domain/ports/user.repository';
import { User } from '../../../domain/entities/user.entity';

export class TypeOrmUserRepository implements UserRepository {
    constructor(private readonly dataSource: DataSource) {}

    async findById(id: number): Promise<User | null> {
        const user = await this.dataSource.getRepository(UserEntity).findOne({ where: { usuarioId: id } });
        return user?.toDomain() || null;
    }

    async findByEmail(email: string): Promise<User | null> {
        const user = await this.dataSource
            .getRepository(UserEntity)
            .createQueryBuilder('user')
            .addSelect('user.contrasena') // Explicitly include the password field
            .where('user.correoElectronico = :email', { email })
            .getOne();
            
        return user?.toDomain() || null;
    }

    async findAll(): Promise<User[]> {
        const users = await this.dataSource.getRepository(UserEntity).find();
        return users.map(user => user.toDomain());
    }

    async save(user: User): Promise<User> {
        const userEntity = UserEntity.fromDomain(user);
        const savedEntity = await this.dataSource.getRepository(UserEntity).save(userEntity);
        return savedEntity.toDomain();
    }

    async update(user: User): Promise<User> {
        const userEntity = UserEntity.fromDomain(user);
        const updatedEntity = await this.dataSource.getRepository(UserEntity).save(userEntity);
        return updatedEntity.toDomain();
    }

    async delete(id: number): Promise<void> {
        await this.dataSource.getRepository(UserEntity).delete({ usuarioId: id });
    }
}
