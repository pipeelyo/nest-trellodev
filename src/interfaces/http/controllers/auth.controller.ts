import { Body, Controller, Post, HttpCode, UsePipes, ValidationPipe, HttpStatus, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../../../application/services/auth.service';
import { UserService } from '../../../application/services/user.service';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBody, 
  ApiProperty, 
  ApiCreatedResponse,
  ApiBadRequestResponse
} from '@nestjs/swagger';
import { User } from '../../../domain/entities/user.entity';
import { IsEmail, IsNotEmpty, IsString, MinLength, MaxLength, IsOptional, IsNumber } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'user@example.com', description: 'User email' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'password123', description: 'User password' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}

export class RegisterDto {
  @ApiProperty({ example: 'Juan', description: 'Primer nombre del usuario' })
  @IsString({ message: 'Nombre inválido' })
  @IsNotEmpty({ message: 'Nombre requerido' })
  @MaxLength(100, { message: 'Máximo 100 caracteres' })
  primerNombre: string;

  @ApiProperty({ example: 'Carlos', description: 'Segundo nombre del usuario (opcional)', required: false })
  @IsString({ message: 'Segundo nombre inválido' })
  @IsOptional()
  @MaxLength(100, { message: 'Máximo 100 caracteres' })
  segundoNombre?: string;

  // Se hace opcional para manejar ambos casos (primerApellido y primerapellido)
  @ApiProperty({ example: 'Pérez', description: 'Primer apellido del usuario', required: false })
  @IsString({ message: 'Apellido inválido' })
  @MaxLength(100, { message: 'Máximo 100 caracteres' })
  primerApellido?: string;

  // Alias para compatibilidad con el frontend
  @ApiProperty({ required: false })
  primerapellido?: string;

  @ApiProperty({ example: 'González', description: 'Segundo apellido del usuario (opcional)', required: false })
  @IsString({ message: 'Segundo apellido inválido' })
  @IsOptional()
  @MaxLength(100, { message: 'Máximo 100 caracteres' })
  segundoApellido?: string;

  @ApiProperty({ example: 1, description: 'ID del tipo de documento' })
  @IsNumber()
  @IsNotEmpty()
  tipoDocumentoId: number;

  @ApiProperty({ example: '12345678', description: 'Número de documento' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  numeroDocumento: string;

  @ApiProperty({ example: 'usuario@ejemplo.com', description: 'Correo electrónico del usuario' })
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(1024)
  correoElectronico: string;

  @ApiProperty({ example: 'password123', description: 'Contraseña del usuario' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(256)
  contrasena: string;

  @ApiProperty({ example: '3001234567', description: 'Número de teléfono (opcional)', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(20)
  telefono?: string;

  @ApiProperty({ example: 'admin', description: 'Usuario que realiza el registro' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(256)
  usuarioCreacion: string;
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ 
    status: 200, 
    description: 'User logged in successfully',
    schema: {
      type: 'object',
      properties: {
        access_token: { type: 'string' },
        user: { $ref: '#/components/schemas/User' }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiBody({ type: LoginDto })
  async login(@Body() loginDto: LoginDto) {
    try {
      console.log('Login attempt for email:', loginDto.email);
      
      const user = await this.authService.validateUser(
        loginDto.email,
        loginDto.password,
      );
      
      if (!user) {
        console.error('No user returned from validateUser');
        throw new UnauthorizedException('Credenciales inválidas');
      }
      
      return this.authService.login(user);
    } catch (error) {
      console.error('Login error:', error);
      // If it's already an UnauthorizedException, rethrow it
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      // For any other error, return a generic message
      throw new UnauthorizedException('Error durante la autenticación');
    }
  }

  @Post('register')
  @HttpCode(201)
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({ summary: 'Register a new user' })
  @ApiCreatedResponse({ 
    description: 'User registered successfully',
    type: User
  })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiBody({ type: RegisterDto })
  async register(@Body() registerDto: RegisterDto) {
    // Validar que al menos uno de los campos de apellido esté presente
    if (!registerDto.primerApellido && !registerDto.primerapellido) {
      throw new BadRequestException('Se requiere el primer apellido');
    }
    
    // Usar primerApellido o primerapellido (para compatibilidad)
    const primerApellido = registerDto.primerApellido || registerDto.primerapellido;
    
    const user = await this.authService.register({
      primerNombre: registerDto.primerNombre,
      segundoNombre: registerDto.segundoNombre,
      primerApellido: primerApellido,
      segundoApellido: registerDto.segundoApellido,
      tipoDocumentoId: registerDto.tipoDocumentoId,
      numeroDocumento: registerDto.numeroDocumento,
      correoElectronico: registerDto.correoElectronico,
      contrasena: registerDto.contrasena,
      telefono: registerDto.telefono,
      usuarioCreacion: registerDto.usuarioCreacion,
      estado: 'ACTIVO'
    });
    
    // Remove password from response
    const { contrasena, ...result } = user;
    return result;
  }


}
