import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { Effect } from "../enums/effects";

export class CreateDelegationPolicyDto {
  @IsString()
  @IsNotEmpty()
  policy_issuer: string;

  @IsString()
  @IsNotEmpty()
  access_subject: string;

  @IsString()
  @IsNotEmpty()
  access_token: string

  @IsString()
  @IsNotEmpty()
  type: string = 'EnergyConsumption';

  @IsString()
  @IsNotEmpty()
  identifiers: string = '*';

  @IsString()
  @IsEnum(Effect)
  @IsNotEmpty()
  effect: string = Effect.PERMIT;
}
