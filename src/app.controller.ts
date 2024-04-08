import { Controller, Get, InternalServerErrorException, Logger, Post, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { createJWS } from './utils/jws-helper';
import { ConfigService } from '@nestjs/config';
import * as uuid from 'uuid';
import moment from 'moment';

@Controller()
export class AppController {
    private readonly logger = new Logger(AppController.name);

    constructor(
        private readonly appService: AppService,
        private readonly configService: ConfigService,
    ) { }

    @Get()
    getHello(): string {
        return;
    }

    @Post('/jws/h2m')
    public async generateJWSh2m(@Req() req): Promise<string> {
        const now = moment();
        const iat = now.unix();
        const exp = now.add(30, 'seconds').unix();
        const payload = {
            jti: uuid.v4(),
            iss: req.body.sub,
            sub: req.body.sub,
            aud: req.body.aud,
            iat,
            nbf: iat,
            exp,
            response_type: 'code',
            client_id: req.body.sub,
            scope: 'openid iSHARE sub name contact_details',
            redirect_uri: req.body.redirect_uri,
            state: req.body.state ?? 'af0ifjsldkj',
            nonce: req.body.nonce ?? 'c428224ca5a',
            acr_values: 'urn:http://eidas.europa.eu/LoA/NotNotified/high',
            language: 'en',
        };

        try {
            return await createJWS(
                this.configService.get<string>('JWT_PRIVATE_KEY_H2M'),
                this.configService.get<string[]>('JWT_CERT_CHAIN_H2M'),
                payload,
            );
        } catch (err) {
            this.logger.error(err);
            throw new InternalServerErrorException('Error during H2M JWT generation. Check logs!');
        }
    }

    @Post('/jws/m2m')
    public async generateJWSm2m(@Req() req): Promise<string> {
        const now = moment();
        const iat = now.unix();
        const exp = now.add(30, 'seconds').unix();
        const payload = {
            jti: uuid.v4(),
            iss: req.body.sub,
            sub: req.body.sub,
            aud: req.body.aud,
            iat,
            nbf: iat,
            exp,
        };

        try {
            return await createJWS(
                this.configService.get<string>('JWT_PRIVATE_KEY_M2M'),
                this.configService.get<string[]>('JWT_CERT_CHAIN_M2M'),
                payload,
            );
        } catch (err) {
            this.logger.error(err);
            throw new InternalServerErrorException('Error during M2M JWT generation. Check logs!');
        }
    }
}
