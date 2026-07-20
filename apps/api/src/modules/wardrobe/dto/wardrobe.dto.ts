import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { WardrobeItemType } from '../../../common/enums';

export class CreateWardrobeItemDto {
  @ApiProperty({ enum: WardrobeItemType })
  @IsEnum(WardrobeItemType)
  itemType!: WardrobeItemType;

  @ApiProperty({ example: 'Chaleco invierno' })
  @IsString()
  name!: string;

  @ApiPropertyOptional({ example: 'M' })
  @IsOptional()
  @IsString()
  size?: string;

  @ApiPropertyOptional({ example: 'Rojo' })
  @IsOptional()
  @IsString()
  color?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  photoUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isFavorite?: boolean;
}

export class UpdateWardrobeItemDto {
  @ApiPropertyOptional({ enum: WardrobeItemType })
  @IsOptional()
  @IsEnum(WardrobeItemType)
  itemType?: WardrobeItemType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  size?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  color?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  photoUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isFavorite?: boolean;
}
