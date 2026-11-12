import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const getDatabaseConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get<string>('DB_HOST', 'localhost'),
  port: configService.get<number>('DB_PORT', 5432),
  username: configService.get<string>('DB_USER', 'postgres'),
  password: configService.get<string>('DB_PASS', 'postgres'),
  database: configService.get<string>('DB_NAME', 'school_library'),
  autoLoadEntities: true,
  synchronize: configService.get<string>('NODE_ENV') !== 'production', // تعطيله في الإنتاج
});
