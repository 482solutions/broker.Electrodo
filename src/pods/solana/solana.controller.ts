import { Controller, Post, Body } from '@nestjs/common';
import { SolanaService } from './solana.service';

@Controller('solana')
export class SolanaController {
  constructor(private readonly solanaService: SolanaService) { }

  @Post()
  async create(@Body() data: any) {
    const {report, walletAddress, companyData} = data
    // Generate PDF
    const pdfBuffer = await this.solanaService.generateESGReport(report, companyData);
    //Upload PDF to Pinata
    const pinataHash = await this.solanaService.uploadToPinata(pdfBuffer);
    return this.solanaService.transferToSolana(pinataHash, walletAddress);
  }
}
