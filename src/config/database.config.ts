import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const getDatabaseConfig = (configService: ConfigService): TypeOrmModuleOptions => {
  const isProduction = configService.get<string>('NODE_ENV') === 'production';
  const databaseUrl = configService.get<string>('DATABASE_URL');

  const baseConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    autoLoadEntities: true,
    synchronize: !isProduction, // disabled in production — use migrations
    retryAttempts: 2,           // fail fast instead of retrying 9 times
    retryDelay: 1000,
  };

  if (databaseUrl) {
    // Cloud (Vercel + Supabase): use connection pooler URL with SSL
    return {
      ...baseConfig,
      url: databaseUrl,
      ssl: { rejectUnauthorized: false },
    };
  }

  // Local development: individual env vars, no SSL
  return {
    ...baseConfig,
    host: configService.get<string>('DB_HOST', 'localhost'),
    port: configService.get<number>('DB_PORT', 5432),
    username: configService.get<string>('DB_USER', 'postgres'),
    password: configService.get<string>('DB_PASS', 'postgres'),
    database: configService.get<string>('DB_NAME', 'school_library'),
  };
};
