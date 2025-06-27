import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { TareaController } from '../../interfaces/http/controllers/tarea.controller';
import { TareaService } from '../../application/services/tarea.service';
import { TypeOrmTareaRepository } from '../persistence/typeorm/tarea.repository';
import { TareaEntity } from '../persistence/typeorm/tarea.entity';
import { TareaRepository } from '../../domain/ports/tarea.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([TareaEntity]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
    ConfigModule,
  ],
  controllers: [TareaController],
  providers: [
    {
      provide: 'TareaRepository',
      useFactory: (dataSource: DataSource) => new TypeOrmTareaRepository(dataSource),
      inject: [DataSource],
    },
    {
      provide: TareaService,
      useFactory: (tareaRepository: TareaRepository) => {
        return new TareaService(tareaRepository);
      },
      inject: ['TareaRepository'],
    },
  ],
  exports: [TareaService],
})
export class TareaModule {}
