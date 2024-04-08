import { Module } from '@nestjs/common';
import { FroniusAdapterService } from './fronius-adapter.service';
import { FroniusAdapterController } from './fronius-adapter.controller';
import { HttpModule } from '@nestjs/axios';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
    imports: [
        HttpModule.register({
            timeout: 60000,
            maxRedirects: 2,
        }),
        ScheduleModule.forRoot(),
    ],
    controllers: [FroniusAdapterController],
    providers: [FroniusAdapterService],
})
export class FroniusAdapterModule {}
