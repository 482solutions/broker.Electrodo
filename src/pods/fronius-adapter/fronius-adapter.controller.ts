import { Controller } from '@nestjs/common';
import { FroniusAdapterService } from './fronius-adapter.service';

@Controller('fronius-adapter')
export class FroniusAdapterController {
    constructor(private readonly froniusAdapterService: FroniusAdapterService) {}
}
