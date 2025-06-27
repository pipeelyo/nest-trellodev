import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { TipoDocumentoController } from '../../interfaces/http/controllers/tipo-documento.controller';
import { TipoDocumentoService } from '../../application/services/tipo-documento.service';
import { TypeOrmTipoDocumentoRepository } from '../persistence/typeorm/tipo-documento.repository';
import { TipoDocumentoEntity } from '../persistence/typeorm/tipo-documento.entity';
import { TipoDocumentoRepository } from '../../domain/ports/tipo-documento.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([TipoDocumentoEntity]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '60m' },
      }),
      inject: [ConfigService],
    }),
    ConfigModule,
  ],
  controllers: [TipoDocumentoController],
  providers: [
    {
      provide: 'TipoDocumentoRepository',
      useFactory: (dataSource: DataSource) => new TypeOrmTipoDocumentoRepository(dataSource),
      inject: [DataSource],
    },
    {
      provide: TipoDocumentoService,
      useFactory: (tipoDocumentoRepository: TipoDocumentoRepository) => {
        return new TipoDocumentoService(tipoDocumentoRepository);
      },
      inject: ['TipoDocumentoRepository'],
    },
    ConfigService,
  ],
  exports: [TipoDocumentoService],
})
export class TipoDocumentoModule {}
