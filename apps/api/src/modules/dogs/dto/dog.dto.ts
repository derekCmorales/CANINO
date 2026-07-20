import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { DogGender } from '../../../common/enums';

export class CreateDogDto {
  @ApiProperty({ example: 'Rex' })
  @IsString()
  name!: string;

  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID('4', { message: 'ID de raza inválido' })
  breedId?: string;

  @ApiProperty({ enum: DogGender })
  @IsEnum(DogGender)
  gender!: DogGender;

  @ApiProperty({ example: '2024-05-10' })
  @IsDateString({}, { message: 'Fecha de nacimiento inválida' })
  birthDate!: string;

  @ApiPropertyOptional({ example: 'Antigua Guatemala' })
  @IsOptional()
  @IsString()
  birthPlace?: string;

  @ApiPropertyOptional({ example: '/uploads/photos/rex.jpg' })
  @IsOptional()
  @IsString()
  photoUrl?: string;
}

export class UpdateDogDto {
  @ApiPropertyOptional({ example: 'Rex' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID('4')
  breedId?: string;

  @ApiPropertyOptional({ enum: DogGender })
  @IsOptional()
  @IsEnum(DogGender)
  gender?: DogGender;

  @ApiPropertyOptional({ example: '2024-05-10' })
  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  birthPlace?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  photoUrl?: string;
}

export class UpdateDogPhotoDto {
  @ApiProperty({ example: '/uploads/photos/rex.jpg' })
  @IsString()
  photoUrl!: string;
}
