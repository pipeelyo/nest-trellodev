// In proyecto.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ProyectoController } from '../../interfaces/http/controllers/proyecto.controller';
import { PROYECTO_SERVICE } from '../../application/services/proyecto.service';
import { ProyectoServiceImpl } from '../../application/services/proyecto.service';
import { PROYECTO_REPOSITORY } from '../../domain/ports/proyecto.repository';
import { TypeOrmProyectoRepository } from '../persistence/typeorm/proyecto.repository';
import { ProyectoEntity } from '../../infrastructure/persistence/typeorm/proyecto.entity';
import { ProyectoXTareaEntity } from '../../infrastructure/persistence/typeorm/proyecto-x-tarea.entity';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProyectoEntity, ProyectoXTareaEntity]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'your-secret-key',
        signOptions: { expiresIn: '60m' },
      }),
      inject: [ConfigService],
    }),
    ConfigModule,
  ],
  controllers: [ProyectoController],
  providers: [
    {
      provide: PROYECTO_REPOSITORY,
      useFactory: (dataSource: DataSource) => 
        new TypeOrmProyectoRepository(dataSource),
      inject: [DataSource],
    },
    {
      provide: PROYECTO_SERVICE,
      useClass: ProyectoServiceImpl,
    },
    JwtAuthGuard, 
  ],
  exports: [PROYECTO_SERVICE], // Export the service token
})
export class ProyectoModule {}