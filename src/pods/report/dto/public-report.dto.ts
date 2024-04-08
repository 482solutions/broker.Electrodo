import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsObject, IsString, ValidateNested } from 'class-validator';

export class PropertyDto {
    @IsNotEmpty()
    readonly type: string;
  
    @IsNotEmpty()
    value: any
  }
  
  export class PublicReportDto {
    @IsString()
    @IsNotEmpty()
    id: string; 
    
    @IsString()
    @IsNotEmpty()
    type: string;
  
    @IsObject()
    @ValidateNested() @Type(() => PropertyDto)
    source: PropertyDto
  
    @IsObject()
    @ValidateNested() @Type(() => PropertyDto)
    name: PropertyDto
  
    @IsObject()
    @ValidateNested() @Type(() => PropertyDto)
    address: PropertyDto
  
    @IsObject()
    @ValidateNested() @Type(() => PropertyDto)
    location: PropertyDto
  
    @IsObject()
    @ValidateNested() @Type(() => PropertyDto)
    OEnergyConsumed: PropertyDto
  
    @IsObject()
    @ValidateNested() @Type(() => PropertyDto)
    PGridElectricity: PropertyDto
  
    @IsObject()
    @ValidateNested() @Type(() => PropertyDto)
    PercentageRenewable: PropertyDto

    @IsArray()
    @IsString({ each: true })
    suppliers: PropertyDto
  }
  