import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { IsNotEmpty, IsString, IsDefined, IsNumber } from 'class-validator';
import { ExtendedBaseEntity } from "../../../utils/entity/base";
import { Type } from "class-transformer";
import { PolicyDto } from "../dto/policy.dto";

@Entity()
export class DelegationPolicy extends ExtendedBaseEntity {
    constructor(delegationPolicy: Partial<DelegationPolicy>) {
        super();
        Object.assign(this, delegationPolicy);
    }

    @PrimaryColumn({ nullable: false })
    @IsString()
    @IsNotEmpty()
    policy_issuer: string;

    @PrimaryColumn({ nullable: false })
    @IsString()
    @IsNotEmpty()
    access_subject: string;

    @Column({ type: 'jsonb', default: '"{}"' })
    @IsDefined()
    @Type(() => PolicyDto)
    policy: PolicyDto;
}

