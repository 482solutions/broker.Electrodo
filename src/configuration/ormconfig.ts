import { config as dotenvConfig } from 'dotenv';
import { DataSourceOptions } from 'typeorm';

dotenvConfig({ path: '.env' });

const config: DataSourceOptions = {
    type: 'postgres',
    host: `${process.env.DATABASE_HOST}` ?? 'localhost',
    port: Number(process.env.DATABASE_PORT) ?? 5432,
    username: `${process.env.DATABASE_USERNAME}` ?? 'postgres',
    password: `${process.env.DATABASE_PASSWORD}` ?? 'postgres',
    database: `${process.env.DATABASE_NAME}` ?? 'blockchain4esg',
    entities: [__dirname + '/../**/*.entity.{js,ts}'],
    migrations: ['dist/src/migrations/*{.ts,.js}'],
    synchronize: false,
}

export default config;
