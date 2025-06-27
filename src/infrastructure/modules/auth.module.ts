import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from '../../application/services/auth.service';
import { UserService } from '../../application/services/user.service';
import { AuthController } from '../../interfaces/http/controllers/auth.controller';
import { UserModule } from './user.module';

@Module({
  imports: [
    UserModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const expiresIn = '30m';
        const secret = configService.get<string>('JWT_SECRET') || 'your-secret-key';
        
        return {
          secret,
          signOptions: { 
            expiresIn,
            // Incluir la fecha de expiración en el payload
            notBefore: 0,
            algorithm: 'HS256',
            allowInsecureKeySizes: false,
            allowInvalidAsymmetricKeyTypes: false,
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
