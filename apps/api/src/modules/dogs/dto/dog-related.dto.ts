import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { SourceType } from '../../../common/enums';

export class UpsertOriginDto {
  @ApiProperty({ enum: SourceType })
  @IsEnum(SourceType)
  sourceType!: SourceType;

  @ApiProperty({ example: 'Criadero Los Volcanes' })
  @IsString()
  sourceName!: string;

  @ApiPropertyOptional({ example: 'Bella' })
  @IsOptional()
  @IsString()
  motherName?: string;

  @ApiPropertyOptional({ example: 'Thor' })
  @IsOptional()
  @IsString()
  fatherName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpsertBaptismDto {
  @ApiProperty({ example: '2024-06-15' })
  @IsString()
  ceremonyDate!: string;

  @ApiProperty({ example: 'Rex' })
  @IsString()
  assignedName!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  photoUrls?: string[];
}

export class UpsertPreferencesDto {
  @ApiProperty({ example: 'Nadar, pelotas de tenis' })
  @IsString()
  likes!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  favoriteToys?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  favoriteActivities?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  favoriteTreats?: string;
}

export class UpsertMemorialDto {
  @ApiProperty({ example: '2026-01-15' })
  @IsString()
  deathDate!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  cause?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  burialPlace?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  burialAddress?: string;

  @ApiPropertyOptional()
  @IsOptional()
  latitude?: number;

  @ApiPropertyOptional()
  @IsOptional()
  longitude?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  contactInfo?: string;

  @ApiPropertyOptional({ type: 'array', items: { type: 'object' } })
  @IsOptional()
  timelineJson?: unknown[];
}
