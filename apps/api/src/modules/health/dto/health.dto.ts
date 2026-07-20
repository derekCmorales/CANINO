import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { HealthRecordStatus, HealthRecordType } from '../../../common/enums';

export class CreateHealthRecordDto {
  @ApiProperty({ enum: HealthRecordType })
  @IsEnum(HealthRecordType)
  type!: HealthRecordType;

  @ApiProperty({ example: 'Rabia' })
  @IsString()
  title!: string;

  @ApiPropertyOptional({ example: '2026-04-10' })
  @IsOptional()
  @IsDateString()
  scheduledDate?: string;

  @ApiPropertyOptional({ example: '2026-04-12' })
  @IsOptional()
  @IsDateString()
  appliedDate?: string;

  @ApiPropertyOptional({ enum: HealthRecordStatus })
  @IsOptional()
  @IsEnum(HealthRecordStatus)
  status?: HealthRecordStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  batchNumber?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  diagnosis?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  medication?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateHealthRecordDto {
  @ApiPropertyOptional({ enum: HealthRecordType })
  @IsOptional()
  @IsEnum(HealthRecordType)
  type?: HealthRecordType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  scheduledDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  appliedDate?: string;

  @ApiPropertyOptional({ enum: HealthRecordStatus })
  @IsOptional()
  @IsEnum(HealthRecordStatus)
  status?: HealthRecordStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID('4')
  veterinarianId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  batchNumber?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  diagnosis?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  medication?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}
