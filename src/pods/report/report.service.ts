import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    InternalServerErrorException,
    Logger,
    NotFoundException,
} from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PublicReport } from './entities/report.entity';
import { Repository } from 'typeorm';
import { ReportDto } from './dto/report.dto';

@Injectable()
export class ReportService {
    private readonly logger = new Logger(ReportService.name);

    constructor(
        @InjectRepository(PublicReport)
        private readonly repository: Repository<PublicReport>,
    ) {}

    public async create(createReportDto: CreateReportDto): Promise<ReportDto> {
        try {
            const { organizationId, year, report } = createReportDto;
            const isReportGenerated = await this.repository.findOne({
                where: { organizationId, year },
            });

            if (isReportGenerated) {
                throw new ForbiddenException(
                    `Duplicate data detected. Year: ${year} and organizationId: ${organizationId}`,
                );
            }

            const reportObj = new PublicReport({
                year,
                organizationId,
                report,
            });

            const newReport = await this.repository.save(reportObj);
            this.logger.verbose(`Successfully added a new report: ${JSON.stringify(newReport)}`);
            return newReport;
        } catch (error) {
            this.logger.error('Error creating a new report: ', error?.message, 'Stack Trace: ', error?.stack);
            if (error instanceof ForbiddenException) {
                throw error;
            }
            throw new InternalServerErrorException('Failed to create a new report');
        }
    }

    public async findAll(): Promise<ReportDto[]> {
        try {
            const reports = await this.repository.find();
            this.logger.verbose(`Successfully receiving all reports: ${JSON.stringify(reports)}`);
            return reports;
        } catch (error) {
            this.logger.error('Error getting reports: ', error?.message, 'Stack Trace: ', error?.stack);
            throw new InternalServerErrorException('Failed to retrieve list of reports.');
        }
    }

    public async findOne(id: string): Promise<ReportDto> {
        try {
            const report = await this.repository.findOne({ where: { id } });
            if (!report) {
                throw new NotFoundException('Report with the specified Id was not found');
            }
            this.logger.verbose(`Successfully receiving the report: ${JSON.stringify(report)}`);
            return report;
        } catch (error) {
            this.logger.error(`Error getting report by Id: ${id}`, error?.message, 'Stack Trace: ', error?.stack);

            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException('Failed to retrieve the report');
        }
    }

    public async update(id: string, report: UpdateReportDto['report']): Promise<ReportDto> {
        try {
            const publicReport = await this.repository.findOneBy({ id });
            if (!publicReport) {
                throw new NotFoundException('Report with the specified Id was not found');
            }
            publicReport.report = report;

            return await this.repository.save(publicReport);
        } catch (error) {
            this.logger.error(
                `Error updating report by Id: ${id}. Data: ${report}.`,
                error?.message,
                'Stack Trace: ',
                error?.stack,
            );

            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException('Failed to update the report');
        }
    }

    public async findByOrganization(organizationId: string, year: number): Promise<ReportDto> {
        try {
            const report = await this.repository.findOne({
                where: { organizationId, year },
            });
            if (!report) {
                throw new NotFoundException(`No report was found. Organization Id: ${organizationId}. Year ${year}`);
            }
            this.logger.verbose(`Successfully receiving the report: ${JSON.stringify(report)}`);
            return report;
        } catch (error) {
            this.logger.error(
                `Error getting report by year ${year} and organization ${organizationId}: `,
                error?.message,
                'Stack Trace: ',
                error?.stack,
            );

            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException('Failed to get the report by organization and year');
        }
    }

    async formulatePublicReport(privateReport: any) {
        try {
            this.logger.verbose(`New changes in OCB. Details: ${JSON.stringify(privateReport)}`);
            privateReport = privateReport.data[0];
            const OEnergyConsumed = privateReport.OEnergyConsumed?.value || {};
            const PGridElectricity = privateReport.PGridElectricity?.value || {};
            const PercentageRenewable = privateReport.PercentageRenewable?.value || {};

            const annualObjectOEnergyConsumed = Object.values(OEnergyConsumed)
                .filter((val) => Number(val))
                .reduce((total: number, amount: number) => (amount === 0 ? total : total + amount), 0);
            const annualPGridElectricity = Object.values(PGridElectricity)
                .filter((val) => Number(val))
                .reduce((total: number, amount: number) => (amount === 0 ? total : total + amount), 0);
            const percentageRenewable: any = Object.values(PercentageRenewable)
                .filter((val) => Number(val))
                .reduce(
                    (total: any, amount: number) => {
                        if (amount !== 0) {
                            total.annualPercentageRenewable += amount;
                            total.nonZeroCount++;
                        }
                        return total;
                    },
                    { annualPercentageRenewable: 0, nonZeroCount: 0 },
                );

            const currentYear = new Date().getFullYear();
            const publicReport = { ...privateReport };
            const { annualPercentageRenewable, nonZeroCount } = percentageRenewable;

            publicReport.OEnergyConsumed.value = {
                [currentYear]: annualObjectOEnergyConsumed,
            };
            publicReport.PGridElectricity.value = {
                [currentYear]: annualPGridElectricity,
            };
            publicReport.PercentageRenewable.value = {
                [currentYear]: nonZeroCount === 0 ? 0 : (annualPercentageRenewable / nonZeroCount).toFixed(3),
            };

            const report = await this.repository.findOne({
                where: { organizationId: publicReport.id, year: currentYear },
            });

            if (report) {
                await this.update(report?.id, publicReport);
            } else {
                await this.create({
                    report: publicReport,
                    year: currentYear,
                    organizationId: publicReport?.id,
                });
            }

            return publicReport;
        } catch (error) {
            this.logger.error(
                'Error in collecting annual public report: ',
                error?.message,
                'Stack Trace: ',
                error?.stack,
            );
            throw new InternalServerErrorException('Failed to calculate annual report');
        }
    }

    async getPolicyTargetIdentifiers(reportId: string) {
        try {
            const currentYear = new Date().getFullYear();
            if (!reportId) {
                throw new BadRequestException({ message: 'Report id is required' });
            }
            const publicReport = await this.findByOrganization(reportId, currentYear);
            if (!publicReport) {
                throw new NotFoundException({
                    message: `No report was found for the specified identifier: ${reportId}.`,
                });
            }

            const suppliers = (publicReport as any).report?.suppliers.value || [];
            return [reportId, ...suppliers];
        } catch (error) {
            this.logger.error(
                `Error getting the list of suppliers by report Id ${reportId}: `,
                error?.message,
                'Stack Trace: ',
                error?.stack,
            );
            if (error instanceof NotFoundException || error instanceof BadRequestException) {
                throw error;
            }
            throw new InternalServerErrorException('Failed to get the list of suppliers');
        }
    }

    async addSuppliers(reportId: string, suppliers: string[]) {
        try {
            const currentYear = new Date().getFullYear();
            const publicReport = await this.findByOrganization(reportId, currentYear);
            const report = publicReport?.report;
            const reportSuppliers = report?.suppliers;

            suppliers.forEach((identifier: string) => {
                if (!reportSuppliers?.value.includes(identifier)) {
                    reportSuppliers?.value.push(identifier);
                }
            });

            report.suppliers = reportSuppliers;
            await this.update(publicReport?.id, report);
        } catch (error) {
            this.logger.error('Error updating the list of suppliers: ', error?.message, 'Stack Trace: ', error?.stack);
            throw error;
        }
    }
}
