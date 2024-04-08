import { Controller, Get, Post, Body, Patch, Param, UsePipes, ValidationPipe, Put } from '@nestjs/common';
import { ReportService } from './report.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { ReportDto } from './dto/report.dto';

@Controller('report')
@UsePipes(ValidationPipe)

export class ReportController {
  constructor(private readonly reportService: ReportService) { }

  @Post()
  public async create(@Body() createReportDto: CreateReportDto): Promise<ReportDto> {
    return this.reportService.create(createReportDto);
  }

  @Post('/annual-report')
  formulateAnnualReport(@Body() privateReportDto: CreateReportDto['report']) {
    return this.reportService.formulatePublicReport(privateReportDto);
  }

  @Get()
  public async findAll(): Promise<ReportDto[]> {
    return this.reportService.findAll();
  }

  @Get(':id')
  public async findOne(@Param('id') id: string): Promise<ReportDto> {
    return this.reportService.findOne(id);
  }

  @Get(':organizationId/:year')
  public async findByOrganization(
    @Param('organizationId') organizationId: string,
    @Param('year') year: number
  ): Promise<ReportDto> {
    return this.reportService.findByOrganization(organizationId, year);
  }

  @Patch(':id')
  public async update(@Param('id') id: string, @Body() updateReportDto: UpdateReportDto['report']): Promise<ReportDto> {
    return this.reportService.update(id, updateReportDto);
  }

}
