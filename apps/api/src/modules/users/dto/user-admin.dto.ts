import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { AdminSubtype, UserRole } from '../../../common/enums';

export class UpdateUserRoleDto {
  @ApiProperty({ enum: UserRole })
  @IsEnum(UserRole, { message: 'Rol inválido' })
  role!: UserRole;

  @ApiPropertyOptional({ enum: AdminSubtype })
  @IsOptional()
  @IsEnum(AdminSubtype, { message: 'Sub-rol de administrador inválido' })
  adminSubtype?: AdminSubtype;
}

export class UpdateUserStatusDto {
  @ApiProperty({ example: true })
  @IsBoolean()
  isActive!: boolean;
}

export class UpdateWhatsappDto {
  @ApiProperty({ example: true })
  @IsBoolean()
  whatsappOptIn!: boolean;
}
