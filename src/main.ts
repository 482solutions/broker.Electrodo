import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { defaultPrivateReports, gracefulShutdown } from './utils';
import { SubscriptionService } from './pods/subscription/subscription.service';
import createConfig from './configuration/config';
import NGSI from 'ngsijs';

async function createSubscription(connection: NGSI.Connection, BACKEND_URL: string) {
    try {
        const subscriptionPayload = {
            description: 'Notify me of all context changes',
            type: 'Subscription',
            entities: [{ type: 'EnergyConsumption' }],
            watchedAttributes: [
                'id',
                'type',
                'source',
                'name',
                'address',
                'location',
                'OEnergyConsumed',
                'PGridElectricity',
                'PercentageRenewable',
            ],
            notification: {
                format: 'normalized',
                endpoint: {
                    uri: `${BACKEND_URL}/report/annual-report`,
                },
            },
        };
        const response = await connection.ld.createSubscription(subscriptionPayload, {});
        console.log('Response to create a new subscription', response);

        return response;
    } catch (error) {
        console.log('Error creating the subscription: ', error?.message, 'Stack Trace: ', error?.stack);
    }
}

async function suppliersDataSubscription(connection: NGSI.Connection, BACKEND_URL: string) {
    try {
        const subscriptionPayload = {
            description: 'Notify me of suppliers changes',
            type: 'Subscription',
            entities: [{ type: 'EnergyConsumption' }],
            watchedAttributes: ['suppliers'],
            notification: {
                format: 'normalized',
                endpoint: {
                    uri: `${BACKEND_URL}/subscription/suppliers-data`,
                },
            },
        };

        const response = await connection.ld.createSubscription(subscriptionPayload, {});
        console.log('Created a new subscription to suppliers data', response);

        return response;
    } catch (error) {
        console.log('Error creating the subscription for suppliers data: ', error?.message, 'Stack Trace: ', error?.stack);
    }
}

async function createDefaultPrivateReports(connection: NGSI.Connection) {
    const createEntityPromises = defaultPrivateReports.map(
        (report, index) =>
            new Promise((resolve) => {
                setTimeout(async () => {
                    const entity = await connection.ld.createEntity(report, {});
                    resolve(entity);
                }, index * 10000);
            }),
    );
    try {
        await Promise.all(createEntityPromises);
        console.log('Private reports created successfully');
    } catch (error) {
        console.error('An error occurred while creating private reports: ', error?.message, 'Stack Trace: ', error?.stack);
    }
}

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const subscriptionService = app.get(SubscriptionService);
    const config = app.get<ConfigService>(ConfigService);
    const CONTEXT_BROKER_HOST = config.get<string>('CONTEXT_BROKER_HOST');
    const CONTEXT_BROKER_PORT = config.get<string>('CONTEXT_BROKER_PORT');
    const BACKEND_URL = config.get<string>('BACKEND_URL');
    const BACKEND_PORT = config.get<string>('BACKEND_PORT');
    const NODE_ENV = config.get<string>('NODE_ENV');

    const configKeys = createConfig();

    for (const key in configKeys) {
        const configValue = config.get<string | string[]>(key);
        // checking the values for keys: JWT_CERT_CHAIN_H2M and JWT_CERT_CHAIN_M2M
        if (Array.isArray(configValue) && !configValue.length) {
            console.log(`No values specified for key: ${key}.`);
            await gracefulShutdown(app)
        }

        if (!configValue) {
            console.log(`${key} not found`)
            await gracefulShutdown(app)
        }
    }

    await app.listen(BACKEND_PORT);

    const connection = new NGSI.Connection(`${CONTEXT_BROKER_HOST}:${CONTEXT_BROKER_PORT}`);

    const subscriptions = await connection.ld.listSubscriptions({})

    if (!subscriptions?.results?.length) {
        await createSubscription(connection, BACKEND_URL);
        await suppliersDataSubscription(connection, BACKEND_URL);
    }
    if (NODE_ENV === 'DEV') {
        await subscriptionService.createDefaultPolicies();

        // Retrieves the available entities (private reports) by type
        const options = { "type": "EnergyConsumption" };
        const entities = await connection.ld.queryEntities(options)

        if (!entities?.results?.length) {
            await createDefaultPrivateReports(connection);
        }
    }
}
bootstrap();
