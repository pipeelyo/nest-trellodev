import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../domain/entities/user.entity';
import { UserService } from './user.service';

export interface LoginResponse {
  access_token: string;
  expires_in: number;      // Tiempo de expiración en segundos
  expires_at: string;     // Fecha de expiración en formato ISO
  user: Omit<User, 'contrasena'>;
}

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    try {
      console.log(`Attempting to validate user with email: ${email}`);
      
      const user = await this.userService.findByEmail(email);
      if (!user) {
        console.error(`No user found with email: ${email}`);
        throw new UnauthorizedException('Usuario o contraseña incorrectos');
      }

      console.log(`User found, validating password for: ${user.correoElectronico}`);
      const isPasswordValid = await this.userService.validatePassword(user, password);
      
      if (!isPasswordValid) {
        console.error(`Invalid password for user: ${user.correoElectronico}`);
        throw new UnauthorizedException('Usuario o contraseña incorrectos');
      }

      console.log(`User ${user.correoElectronico} authenticated successfully`);
      return user;
    } catch (error) {
      console.error('Error in validateUser:', error);
      // Don't leak too much information in the error message
      throw new UnauthorizedException('Error durante la autenticación');
    }
  }

  async login(user: User): Promise<LoginResponse> {
    // Calcular la fecha de expiración (30 minutos desde ahora)
    const expiresIn = 30 * 60; // 30 minutos en segundos
    const expirationTime = Math.floor(Date.now() / 1000) + expiresIn;
    
    const payload = { 
      sub: user.usuarioId, 
      email: user.correoElectronico,
      name: `${user.primerNombre} ${user.primerApellido}`,
      // No incluir 'exp' aquí, se manejará automáticamente
      iat: Math.floor(Date.now() / 1000) // Fecha de emisión
    };
    
    // Crear el token con la expiración en las opciones
    const token = this.jwtService.sign(payload, { expiresIn: `${expiresIn}s` });
    
    // Create a user object without the password
    const { contrasena, ...userWithoutPassword } = user;
    
    return {
      access_token: token,
      expires_in: expiresIn,
      expires_at: new Date(expirationTime * 1000).toISOString(),
      user: userWithoutPassword as Omit<User, 'contrasena'>,
    };
  }

  async register(createUserDto: any): Promise<User> {
    return this.userService.create(createUserDto);
  }
}
