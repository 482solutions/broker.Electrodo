import { DataSource, DataSourceOptions } from "typeorm";
import config from './src/configuration/ormconfig'

export const connectionSource = new DataSource(config as DataSourceOptions);