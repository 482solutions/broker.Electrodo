import { DataSourceOptions } from 'typeorm';
import ormconfig from './ormconfig';

interface ApplicationConfig {
    CONTEXT_BROKER_HOST: string;
    CONTEXT_BROKER_PORT: string;
    TYPEORM: DataSourceOptions;
    BACKEND_URL: string;
    CONNECT_AR_URL: string;
    BACKEND_PORT: string;
    CLIENT_ID: string;
    IDP_ID: string;
    CLIENT_ASSERTION_TYPE: string;
    GRANT_TYPE: string;
    SCOPE: string;
    JWT_PRIVATE_KEY_H2M: string;
    JWT_PRIVATE_KEY_M2M: string;
    JWT_CERT_CHAIN_H2M: string[];
    JWT_CERT_CHAIN_M2M: string[];
    TOKEN_ENDPOINT: string;
    POLICY_ENDPOINT: string;
    ACCESS_SUBJECT_1: string;
    ACCESS_SUBJECT_2: string;
    ACCESS_SUBJECT_3: string;
    SOLAR_WEB_URL: string;
    SOLAR_WEB_API_URL: string;
    STATION_A_ID: string;
    STATION_B_ID: string;
    FRONIUS_USERNAME: string;
    FRONIUS_PASSWORD: string;
    NODE_ENV: string;
    SOLANA_ENDPOINT: string;
    SOLANA_PRIVATE_KEY: string;
    PINATA_ENDPOINT: string;
    PINATA_JWT: string;
    PINATA_API_KEY: string;
    PINATA_API_SECRET: string;
    SPL_ADDRESS: string

}

export default function createConfig(): ApplicationConfig {
    return {
        CONTEXT_BROKER_HOST: process.env.CONTEXT_BROKER_HOST ?? '',
        CONTEXT_BROKER_PORT: process.env.CONTEXT_BROKER_PORT ?? '',
        TYPEORM: ormconfig,
        BACKEND_URL: process.env.BACKEND_URL ?? '',
        CONNECT_AR_URL: process.env.CONNECT_AR_URL ?? '',
        BACKEND_PORT: process.env.BACKEND_PORT ?? '',
        CLIENT_ID: process.env.CLIENT_ID ?? '',
        IDP_ID: process.env.IDP_ID ?? '',
        CLIENT_ASSERTION_TYPE:
            process.env.CLIENT_ASSERTION_TYPE ?? '',
        GRANT_TYPE: process.env.GRANT_TYPE ?? '',
        SCOPE: process.env.SCOPE ?? '',
        JWT_PRIVATE_KEY_H2M:
            process.env.JWT_H2M_PRIVATE_KEY ?? '',
        JWT_PRIVATE_KEY_M2M:
            process.env.JWT_M2M_PRIVATE_KEY ?? '',
        JWT_CERT_CHAIN_H2M: process.env.JWT_H2M_CERT_CHAIN?.split(';') ?? [],
        JWT_CERT_CHAIN_M2M: process.env.JWT_M2M_CERT_CHAIN?.split(';') ?? [],
        TOKEN_ENDPOINT: process.env.TOKEN_ENDPOINT ?? '',
        POLICY_ENDPOINT: process.env.POLICY_ENDPOINT ?? '',
        ACCESS_SUBJECT_1: process.env.ACCESS_SUBJECT_1 ?? '',
        ACCESS_SUBJECT_2: process.env.ACCESS_SUBJECT_2 ?? '',
        ACCESS_SUBJECT_3: process.env.ACCESS_SUBJECT_3 ?? '',
        SOLAR_WEB_URL: process.env.SOLAR_WEB_URL ?? '',
        STATION_A_ID: process.env.STATION_A_ID ?? '',
        STATION_B_ID: process.env.STATION_B_ID ?? '',
        SOLAR_WEB_API_URL: process.env.SOLAR_WEB_API_URL ?? '',
        FRONIUS_USERNAME: process.env.FRONIUS_USERNAME ?? '',
        FRONIUS_PASSWORD: process.env.FRONIUS_PASSWORD ?? '',
        NODE_ENV: process.env.NODE_ENV ?? '',
        SOLANA_ENDPOINT: process.env.SOLANA_ENDPOINT ?? '',
        SOLANA_PRIVATE_KEY: process.env.SOLANA_PRIVATE_KEY ?? '',
        PINATA_ENDPOINT: process.env.PINATA_ENDPOINT ?? '',
        PINATA_JWT: process.env.PINATA_JWT ?? '',
        PINATA_API_KEY: process.env.PINATA_API_KEY ?? '',
        PINATA_API_SECRET: process.env.PINATA_API_SECRET ?? '',
        SPL_ADDRESS: process.env.SPL_ADDRESS ?? '',
    };
}
