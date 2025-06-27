import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './infrastructure/modules/user.module';
import { AuthModule } from './infrastructure/modules/auth.module';
import { TipoDocumentoModule } from './infrastructure/modules/tipo-documento.module';
import { TareaModule } from './infrastructure/modules/tarea.module';
import { ProyectoModule } from './infrastructure/modules/proyecto.module';
import { AppDataSource } from './database.providers';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async () => {
        if (!AppDataSource.isInitialized) {
          await AppDataSource.initialize();
        }
        return AppDataSource.options;
      },
    }),
    UserModule,
    AuthModule,
    TipoDocumentoModule,
    TareaModule,
    ProyectoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}