import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminSubtype, UserRole } from '../../common/enums';
import { AdminSubtypes, Roles } from '../../common/decorators/roles.decorator';
import { successResponse } from '../../common/dto/api-response.dto';
import { AdminService } from './admin.service';

@ApiTags('Administración')
@ApiBearerAuth()
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats')
  @Roles(UserRole.ADMIN)
  @AdminSubtypes(AdminSubtype.SUPER_ADMIN)
  @ApiOperation({ summary: 'Obtener métricas globales del sistema' })
  async stats() {
    const stats = await this.adminService.getStats();
    return successResponse(stats);
  }

  @Get('audit-logs')
  @Roles(UserRole.ADMIN)
  @AdminSubtypes(AdminSubtype.SUPER_ADMIN, AdminSubtype.OPERATIONS)
  @ApiOperation({ summary: 'Consultar registros de auditoría' })
  async auditLogs(@Query('limit') limit?: string) {
    const logs = await this.adminService.getAuditLogs(limit ? Number(limit) : 100);
    return successResponse(logs);
  }
}
