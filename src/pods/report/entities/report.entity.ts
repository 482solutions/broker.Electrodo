import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";
import { IsNotEmpty, IsString, IsNumber, IsDefined } from 'class-validator';
import { PublicReportDto } from "../dto/public-report.dto";
import { Type } from "class-transformer";
import { ExtendedBaseEntity } from "../../../utils/entity/base";

@Entity()
@Unique(['organizationId','year'])

export class PublicReport extends ExtendedBaseEntity {
    constructor(publicReport: Partial<PublicReport>) {
        super();
        Object.assign(this, publicReport);
    }
    @PrimaryGeneratedColumn()
    @IsString()
    @IsNotEmpty()
    id: string;

    @Column({ nullable: false })
    @IsString()
    @IsNotEmpty()
    organizationId: string;

    @Column({ nullable: false })
    @IsNumber()
    year: number;

    @Column({ type: 'jsonb', default: '"{}"' })
    @IsDefined()
    @Type(() => PublicReportDto)
    report: PublicReportDto;
}

