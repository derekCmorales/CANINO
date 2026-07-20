import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminSubtype, UserRole } from '../../common/enums';
import { AdminSubtypes, Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser, JwtPayload } from '../../common/decorators/current-user.decorator';
import { successResponse } from '../../common/dto/api-response.dto';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import {
  UpdateUserRoleDto,
  UpdateUserStatusDto,
  UpdateWhatsappDto,
} from './dto/user-admin.dto';

@ApiTags('Usuarios')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Obtener perfil del usuario autenticado' })
  async getMe(@CurrentUser('sub') userId: string) {
    const user = await this.usersService.findById(userId);
    return successResponse(user);
  }

  @Patch('me')
  @Roles(UserRole.OWNER)
  @ApiOperation({ summary: 'Actualizar perfil del dueño' })
  async updateMe(@CurrentUser('sub') userId: string, @Body() dto: UpdateProfileDto) {
    const user = await this.usersService.updateProfile(userId, dto);
    return successResponse(user);
  }

  @Patch('me/whatsapp')
  @Roles(UserRole.OWNER)
  @ApiOperation({ summary: 'Activar o desactivar notificaciones WhatsApp' })
  async updateWhatsapp(@CurrentUser('sub') userId: string, @Body() dto: UpdateWhatsappDto) {
    const user = await this.usersService.updateWhatsapp(userId, dto);
    return successResponse(user);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Listar todos los usuarios (admin)' })
  async findAll() {
    const users = await this.usersService.findAll();
    return successResponse(users);
  }

  @Patch(':id/role')
  @Roles(UserRole.ADMIN)
  @AdminSubtypes(AdminSubtype.SUPER_ADMIN)
  @ApiOperation({ summary: 'Cambiar rol de un usuario' })
  async updateRole(@Param('id') id: string, @Body() dto: UpdateUserRoleDto) {
    const user = await this.usersService.updateRole(id, dto);
    return successResponse(user);
  }

  @Patch(':id/status')
  @Roles(UserRole.ADMIN)
  @AdminSubtypes(AdminSubtype.SUPER_ADMIN, AdminSubtype.OPERATIONS)
  @ApiOperation({ summary: 'Activar o desactivar un usuario' })
  async updateStatus(@Param('id') id: string, @Body() dto: UpdateUserStatusDto) {
    const user = await this.usersService.updateStatus(id, dto);
    return successResponse(user);
  }
}
