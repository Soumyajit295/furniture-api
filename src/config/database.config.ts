import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleAsyncOptions = {
  inject: [ConfigService],

  useFactory: (config: ConfigService) => ({
    type: 'postgres',
    host: config.get('DB_HOST'),
    port: Number(config.get('DB_PORT')),
    username: config.get('DB_USER'),
    password: config.get('DB_PASS'),
    database: config.get('DB_NAME'),

    autoLoadEntities: false,
    synchronize: false,
    entities: [__dirname + '/../entities/*.{ts,js}'],
    migrations: [__dirname + '/../../migrations/*.{ts,js}'],
  }),
};
