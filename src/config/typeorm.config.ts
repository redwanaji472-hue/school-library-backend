import { DataSource } from 'typeorm';
import { config } from 'dotenv';

// Load environment variables
config();

// NOTE: This DataSource config is for TypeORM CLI only (migration:generate, etc.)
// It is NOT used at runtime. The app uses getDatabaseConfig() from database.config.ts
// Migrations are disabled - using synchronize for initial deploy
export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'postgres',
  database: process.env.DB_NAME || 'school_library',
  entities: ['src/**/*.entity.ts'],
  migrations: [], // No migrations - using entity synchronization
  synchronize: false,
});
