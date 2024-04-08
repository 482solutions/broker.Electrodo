import { INestApplication } from "@nestjs/common";

export const gracefulShutdown = async (app: INestApplication) => {
    try {
        console.log('Gracefully shutting down...');
        await app.close();
        console.log('Nest application closed gracefully');
        process.exit(0);
    } catch (error) {
        console.error(`Error during graceful shutdown: ${error}`);
        process.exit(1);
    }
}
