import { Inject, Injectable, NotFoundException, ConflictException, UnauthorizedException } from '@nestjs/common';
import { User } from '../../domain/entities/user.entity';
import { UserRepository } from '../../domain/ports/user.repository';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @Inject('UserRepository') 
    private readonly userRepository: UserRepository
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Check if user with email already exists
    const existingUser = await this.userRepository.findByEmail(createUserDto.correoElectronico);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(createUserDto.contrasena, 10);
    const now = new Date();

    // Create new user with all required fields
    const user = new User(
      undefined, // usuarioId (auto-generated)
      createUserDto.primerNombre, // primerNombre (required)
      createUserDto.segundoNombre || '', // segundoNombre (optional)
      createUserDto.primerApellido, // primerApellido (required)
      createUserDto.segundoApellido || '', // segundoApellido (optional)
      createUserDto.tipoDocumentoId, // tipoDocumentoId (defaults to 1 in DTO)
      createUserDto.numeroDocumento || '', // numeroDocumento (optional)
      createUserDto.correoElectronico, // correoElectronico (required)
      hashedPassword, // contrasena (hashed, required)
      createUserDto.telefono || '', // telefono (optional)
      'ACTIVO', // estado (default)
      now, // fechaHoraCreacion
      createUserDto.usuarioCreacion, // usuarioCreacion (required)
      now, // fechaHoraActualizacion
      createUserDto.usuarioCreacion // usuarioActualizacion (same as creation user)
    );
    
    console.log('Creating user with data:', user); // Debug log

    return this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Check if email is being updated and if it's already taken
    if (updateUserDto.correoElectronico && updateUserDto.correoElectronico !== user.correoElectronico) {
      const existingUser = await this.userRepository.findByEmail(updateUserDto.correoElectronico);
      if (existingUser) {
        throw new ConflictException('Email already in use');
      }
    }

    // Update user fields
    if (updateUserDto.nombre !== undefined) user.primerNombre = updateUserDto.nombre;
    if (updateUserDto.segundoNombre !== undefined) user.segundoNombre = updateUserDto.segundoNombre;
    if (updateUserDto.apellido !== undefined) user.primerApellido = updateUserDto.apellido;
    if (updateUserDto.segundoApellido !== undefined) user.segundoApellido = updateUserDto.segundoApellido;
    if (updateUserDto.tipoDocumentoId !== undefined) user.tipoDocumentoId = updateUserDto.tipoDocumentoId;
    if (updateUserDto.numeroDocumento !== undefined) user.numeroDocumento = updateUserDto.numeroDocumento;
    if (updateUserDto.correoElectronico !== undefined) user.correoElectronico = updateUserDto.correoElectronico;
    if (updateUserDto.telefono !== undefined) user.telefono = updateUserDto.telefono;
    if (updateUserDto.estado !== undefined) user.estado = updateUserDto.estado;

    // Handle password update if provided
    if (updateUserDto.contrasena) {
      const hashedPassword = await bcrypt.hash(updateUserDto.contrasena, 10);
      user.contrasena = hashedPassword;
    }

    // Update timestamps
    user.fechaHoraActualizacion = new Date();
    if (updateUserDto.usuarioActualizacion) {
      user.usuarioActualizacion = updateUserDto.usuarioActualizacion;
    }
    user.usuarioId = id; // Ensure ID is not changed

    return this.userRepository.update(user);
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  async validatePassword(user: User, password: string): Promise<boolean> {
    if (!user || !user.contrasena) {
      console.error('User or password hash missing');
      return false;
    }

    try {
      console.log('Validating password for user:', user.correoElectronico);
      
      // Log the first few characters of the password for debugging (don't log the whole thing)
      const pwdPreview = password ? `${password.substring(0, 2)}...` : 'empty';
      console.log(`Provided password (preview): ${pwdPreview}`);
      
      const hashPreview = user.contrasena ? `${user.contrasena.substring(0, 10)}...` : 'empty';
      console.log(`Stored hash (preview): ${hashPreview}`);
      
      const isMatch = await bcrypt.compare(password, user.contrasena);
      console.log('Password match:', isMatch);
      
      return isMatch;
    } catch (error) {
      console.error('Error validating password:', error);
      return false;
    }
  }

  async changePassword(userId: number, currentPassword: string, newPassword: string): Promise<boolean> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await this.validatePassword(user, currentPassword);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    user.contrasena = await bcrypt.hash(newPassword, 10);
    await this.userRepository.update(user);
    return true;
  }
}
