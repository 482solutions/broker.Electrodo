import { IsDate, IsNotEmpty, IsNumber, IsObject, IsString } from 'class-validator';
import { PublicReportDto } from './public-report.dto';

export class ReportDto {
    @IsString()
    @IsNotEmpty()
    id: string;

    @IsString()
    @IsNotEmpty()
    organizationId: string;

    @IsNumber()
    @IsNotEmpty()
    year: number;

    @IsObject()
    report: PublicReportDto;

}
