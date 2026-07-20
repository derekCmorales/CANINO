import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateMemoryDto {
  @ApiProperty({ example: '/uploads/memories/familia.jpg' })
  @IsString()
  photoUrl!: string;

  @ApiPropertyOptional({ example: 'Primer día en casa' })
  @IsOptional()
  @IsString()
  caption?: string;

  @ApiPropertyOptional({ example: '2024-05-15' })
  @IsOptional()
  @IsDateString()
  memoryDate?: string;

  @ApiPropertyOptional({ example: 'Derek y familia' })
  @IsOptional()
  @IsString()
  people?: string;
}

export class UpdateMemoryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  photoUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  caption?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  memoryDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  people?: string;
}
