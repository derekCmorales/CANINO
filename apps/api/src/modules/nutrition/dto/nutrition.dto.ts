import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { LifeStage } from '../../../common/enums';

export class CreateNutritionPlanDto {
  @ApiProperty({ enum: LifeStage })
  @IsEnum(LifeStage)
  lifeStage!: LifeStage;

  @ApiProperty({ example: 'Alimento premium para cachorro, 2 veces al día' })
  @IsString()
  dietDescription!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  restrictions?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  favoriteFood?: string;

  @ApiProperty({ example: '2024-05-10' })
  @IsDateString()
  activeFrom!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  activeTo?: string;
}

export class CreateMealLogDto {
  @ApiProperty({ example: 'Desayuno' })
  @IsString()
  mealType!: string;

  @ApiPropertyOptional({ example: 'Royal Canin' })
  @IsOptional()
  @IsString()
  brand?: string;

  @ApiPropertyOptional({ example: '150g' })
  @IsOptional()
  @IsString()
  portion?: string;
}
