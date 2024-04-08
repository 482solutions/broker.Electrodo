import { Controller, Post, Body } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';

@Controller('subscription')
export class SubscriptionController {
    constructor(private readonly subscriptionService: SubscriptionService) {}

    @Post('/suppliers-data')
    public create(@Body() privateReport: any): Promise<string> {
        return this.subscriptionService.handleSuppliersData(privateReport);
    }
}
