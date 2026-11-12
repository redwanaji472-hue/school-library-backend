import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const getDatabaseConfig = (configService: ConfigService): TypeOrmModuleOptions => {
  const databaseUrl = configService.get<string>('DATABASE_URL');

  const baseConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    autoLoadEntities: true,
    // TODO: Set synchronize to false after the first successful deploy and use migrations instead
    synchronize: true, 
    // Temporarily enabled to create tables on Railway + Supabase
    dropSchema: true,
    retryAttempts: 2,
    retryDelay: 1000,
    logging: ['error', 'warn'],
  };

  if (databaseUrl) {
    // Cloud (Railway + Supabase): use DATABASE_URL with SSL
    return {
      ...baseConfig,
      url: databaseUrl,
      ssl: { rejectUnauthorized: false },
    };
  }

  // Local development: individual env vars
  return {
    ...baseConfig,
    host: configService.get<string>('DB_HOST', 'localhost'),
    port: configService.get<number>('DB_PORT', 5432),
    username: configService.get<string>('DB_USER', 'postgres'),
    password: configService.get<string>('DB_PASS', 'postgres'),
    database: configService.get<string>('DB_NAME', 'school_library'),
  };
};
