import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UserEntity } from '../persistence/typeorm/user.entity';
import { TypeOrmUserRepository } from '../persistence/typeorm/user.repository';
import { UserService } from '@/application/services/user.service';
import { UserController } from '@/interfaces/http/controllers/user.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: 'UserRepository',
      useFactory: (dataSource: DataSource) => new TypeOrmUserRepository(dataSource),
      inject: [DataSource],
    },
    UserService,
  ],
  exports: [UserService],
})
export class UserModule {}
