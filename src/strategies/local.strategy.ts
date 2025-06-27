import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../application/services/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email', // or 'username' depending on your auth setup
    });
  }

  async validate(email: string, password: string): Promise<any> {
    console.log('LocalStrategy validate - email:', email);
    console.log('LocalStrategy validate - password provided:', password ? '***' : 'empty');
    
    try {
      const user = await this.authService.validateUser(email, password);
      
      if (!user) {
        console.error('LocalStrategy - No user returned from validateUser');
        throw new UnauthorizedException('Credenciales inválidas');
      }
      
      console.log('LocalStrategy - User validated successfully:', user.correoElectronico);
      return user;
    } catch (error) {
      console.error('LocalStrategy - Error during validation:', error);
      // Re-throw the error to be handled by the global exception filter
      throw error;
    }
  }
}
