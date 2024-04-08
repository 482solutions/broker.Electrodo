import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsObject, IsString, ValidateNested } from 'class-validator';

export class PolicyAttributeDto {
  @IsNotEmpty()
  readonly notBefore: number;

  @IsNotEmpty()
  readonly notOnOrAfter: number;

  @IsNotEmpty()
  @IsString()
  policyIssuer: string;

  @IsNotEmpty()
  @IsObject()
  target: object;

  @IsNotEmpty()
  @IsArray()
  policySets: any[];

}

export class PolicyDto {
  @IsObject()
  @ValidateNested() @Type(() => PolicyAttributeDto)
  delegationEvidence: PolicyAttributeDto
}
