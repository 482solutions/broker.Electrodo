import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import createConfig from './configuration/config';

import { ReportModule } from './pods/report/report.module';
import { DelegationPolicyModule } from './pods/delegation-policy/delegation-policy.module';
import { ReportPolicyModule } from './pods/report-policy/report-policy.module';
import { SubscriptionModule } from './pods/subscription/subscription.module';
import { FroniusAdapterModule } from './pods/fronius-adapter/fronius-adapter.module';
import { SolanaModule } from './pods/solana/solana.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            load: [createConfig],
            isGlobal: true,
        }),
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => configService.get('TYPEORM'),
        }),
        ReportModule,
        DelegationPolicyModule,
        ReportPolicyModule,
        SubscriptionModule,
        FroniusAdapterModule,
        SolanaModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
