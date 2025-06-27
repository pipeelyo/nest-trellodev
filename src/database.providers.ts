import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: '127.0.0.1',  // Usa '127.0.0.1' si no estás usando Docker
  port: 3306,
  username: 'trellouser',
  password: 'trellopass',
  database: 'trellodev',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: true, // Solo en desarrollo
  logging: true,     // Habilita logging para depuración
  extra: {
    connectionLimit: 10,
  }
});

// Este provider ya no es necesario si usas TypeOrmModule.forRootAsync
// Pero lo dejamos por si hay algún otro módulo que lo necesite
export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
      }
      return AppDataSource;
    },
  },
];