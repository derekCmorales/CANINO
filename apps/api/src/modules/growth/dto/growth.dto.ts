import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ExerciseIntensity } from '../../../common/enums';

export class CreateGrowthRecordDto {
  @ApiProperty({ example: 12.5 })
  @IsNumber()
  @Min(0)
  weightKg!: number;

  @ApiProperty({ example: '2024-08-01' })
  @IsDateString()
  recordedAt!: string;
}

export class CreateExerciseLogDto {
  @ApiProperty({ example: 'Caminata' })
  @IsString()
  activityType!: string;

  @ApiProperty({ example: 30 })
  @IsNumber()
  @Min(1)
  durationMinutes!: number;

  @ApiProperty({ enum: ExerciseIntensity })
  @IsEnum(ExerciseIntensity)
  intensity!: ExerciseIntensity;

  @ApiProperty({ example: '2025-08-01' })
  @IsDateString()
  loggedAt!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}
