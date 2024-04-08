import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import NGSI from 'ngsijs';
import { defaultPrivateReports } from '../../utils';
import fetch from 'node-fetch';

type StationDataFormat = {
    selfSufficiency: number[];
    totalEnergy: number[];
};

@Injectable()
export class FroniusAdapterService {
    private readonly orionConnection: NGSI;
    private readonly logger = new Logger(FroniusAdapterService.name);

    constructor(
        private readonly config: ConfigService,
        private readonly httpService: HttpService,
    ) {
        const CONTEXT_BROKER_HOST = config.get<string>('CONTEXT_BROKER_HOST');
        const CONTEXT_BROKER_PORT = config.get<string>('CONTEXT_BROKER_PORT');
        this.orionConnection = new NGSI.Connection(`${CONTEXT_BROKER_HOST}:${CONTEXT_BROKER_PORT}`);
    }

    @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_NOON)
    private async poll() {
        this.logger.log(`Polling Fronius: `);
        await this.retrieveConsumptionData()

    }
   /*
   This is a basic function that we can use after obtaining the necessary access to the Fronius Solar web API.
   The credentials (AccessKeyId and AccessKeyValue) are hardcoded, but once received they will be moved to the configuration file. 
   After receiving the jwtToken, we will fetch all the data from the API and modify the retrieveConsumptionData function.
   */ 
    async login() {
        try {
            const baseHeader = {
                'Content-Type': 'application/json-patch+json',
                AccessKeyId: 'FKIA6A4A867043A1455B8A24FA56AACC74FF',
                AccessKeyValue: '08cadf3b-9052-47f0-9a9e-5349e19f6311',
                Accept: 'application/json',
                'Accept-Language': 'de-de',
                'User-Agent': 'Solar.web/921 CFNetwork/1410.0.3 Darwin/22.6.0',
            }
            const solarWebUrl = this.config.get<string>('SOLAR_WEB_API_URL');
            const userId = this.config.get<string>('FRONIUS_USERNAME');
            const password = this.config.get<string>('FRONIUS_PASSWORD');

            return fetch(solarWebUrl, {
                method: 'post',
                headers: baseHeader,
                body: JSON.stringify({
                    userId,
                    password,
                })
            }).then(resp => resp.json()).then(data => data)

        } catch (error) {
            this.logger.error(
                'Error getting data from Fronius Solar API ',
                error?.message,
                'Stack Trace: ',
                error?.stack,
            );
        }
    }

    // create dedicated Orion related service and encapsulate the logic inside
    private async createReport(dataToCreatePrivateReport: any) {

        try {
            let UscReport = defaultPrivateReports[defaultPrivateReports.length - 1];
            const OEnergyConsumedValue: any = Object.fromEntries(
                Object.keys(UscReport["OEnergyConsumed"].value).map((month, index) => [month, dataToCreatePrivateReport["OEnergyConsumed"][index] || 0])
            );

            const PGridElectricityValue: any = Object.fromEntries(
                Object.keys(UscReport["PGridElectricity"].value).map((month, index) => [month, dataToCreatePrivateReport["PGridElectricity"][index] || 0])
            );

            const PercentageRenewableValue: any = Object.fromEntries(
                Object.keys(UscReport["PercentageRenewable"].value).map((month, index) => [month, dataToCreatePrivateReport["PercentageRenewable"][index] || 0])
            );
            const updatedAttributes = {
                "OEnergyConsumed": {
                    "type": "Property",
                    "value": OEnergyConsumedValue
                },
                "PGridElectricity": {
                    "type": "Property",
                    "value": PGridElectricityValue
                },
                "PercentageRenewable": {
                    "type": "Property",
                    "value": PercentageRenewableValue
                }
            }

            const entity = await this.orionConnection.ld.getEntity({ id: UscReport?.id, keyValues: true })
            if (entity) {
                await this.orionConnection.ld.updateEntityAttributes(updatedAttributes, { id: UscReport?.id })
            }
            else {
                await this.orionConnection.ld.createEntity(UscReport, {})
            }

        } catch (error) {
            this.logger.error(
                'An error occurred while creating private report: ',
                error?.message,
                'Stack Trace: ',
                error?.stack,
            );
        }
    }
    // There is still no way to get cookies programmatically, the only way at the moment is to add them manually
    async fetchData(pvSystemId: string, cookie: string) {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1;
        const currentDay = currentDate.getDate();

        const solarWebUrl = this.config.get<string>('SOLAR_WEB_URL');
        const params = {
            pvSystemId,
            year: String(currentYear),
            month: String(currentMonth),
            day: String(currentDay),
            interval: 'year',
            view: 'consumption'
        };

        const url = solarWebUrl + new URLSearchParams(params).toString();
        return fetch(url, {
            "headers": {
                "cookie": cookie,
            },
            "body": null,
            "method": "GET"

        }).then(resp => resp.json()).then(data => data)

    }
    private transformData(series: any) {
        const transformedData: StationDataFormat = {
            selfSufficiency: [],
            totalEnergy: []
        };

        series?.forEach((entry) => {
            const dataArray = entry.data.map(([_, value]) => value.toFixed(2));
            if (entry.id === "FromGenToConsumer") {
                transformedData.selfSufficiency = dataArray;
            }
            // Calculate total energy consumed
            transformedData.totalEnergy = dataArray.map(
                (value, index) => (transformedData.totalEnergy[index] || 0) + Number(value)
            );
        });

        return transformedData;
    }

    private async retrieveConsumptionData() {
        try {
            let stationAProcessed: StationDataFormat;
            let stationBProcessed: StationDataFormat;

            const stationAId = this.config.get<string>('STATION_A_ID');
            const stationBId = this.config.get<string>('STATION_B_ID');


            const stationAData = await this.fetchData(stationAId, '');
            if (stationAData) {
                stationAProcessed = this.transformData(stationAData?.settings?.series);
            }

            const stationBData = await this.fetchData(stationBId, '');
            if (stationBData) {
                stationBProcessed = this.transformData(stationBData?.settings?.series);
            }
            const OEnergyConsumed = stationAProcessed?.totalEnergy?.map(
                (value, index) => (stationBProcessed?.totalEnergy?.[index] || 0) + Number(value)
            );

            const selfSufficiencyinMWhA = stationAProcessed?.selfSufficiency?.map(
                (value, index) => Number(stationBProcessed?.selfSufficiency?.[index] || 0) + Number(value)
            );
            const PercentageRenewable = selfSufficiencyinMWhA?.map(
                (value, index) => Math.round((value / (OEnergyConsumed[index] || 0)) * 100)
            );

            const PGridElectricity = PercentageRenewable?.map((value) => 100 - value);
            const dataToCreatePrivateReport = {
                OEnergyConsumed,
                PGridElectricity,
                PercentageRenewable,
            };
            await this.createReport(dataToCreatePrivateReport)
            return;

        } catch (error) {
            this.logger.error(
                'An error occurred while retrieving data from fronius ',
                error?.message,
                'Stack Trace: ',
                error?.stack,
            );
        }
    }

    // https://docs.nestjs.com/techniques/task-scheduling
    // https://docs.nestjs.com/techniques/http-module#full-example
}
