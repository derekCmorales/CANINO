import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: 'Derek Morales' })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiPropertyOptional({ example: '+50255551234' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: 'Ciudad de Guatemala' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ example: '/uploads/avatars/user.jpg' })
  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @ApiPropertyOptional({ example: '/uploads/docs/id.pdf' })
  @IsOptional()
  @IsString()
  documentUrl?: string;
}
