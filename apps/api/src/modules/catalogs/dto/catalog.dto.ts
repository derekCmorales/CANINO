import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateBreedDto {
  @ApiProperty({ example: 'Golden Retriever' })
  @IsString()
  name!: string;

  @ApiPropertyOptional({ example: 'large' })
  @IsOptional()
  @IsString()
  sizeCategory?: string;
}

export class UpdateBreedDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  sizeCategory?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class CreateVaccineTypeDto {
  @ApiProperty({ example: 'Rabia' })
  @IsString()
  name!: string;

  @ApiPropertyOptional({ example: 365 })
  @IsOptional()
  recommendedIntervalDays?: number;
}

export class UpdateVaccineTypeDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  recommendedIntervalDays?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
