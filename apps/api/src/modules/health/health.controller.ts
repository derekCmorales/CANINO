import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser, JwtPayload } from '../../common/decorators/current-user.decorator';
import { successResponse } from '../../common/dto/api-response.dto';
import { HealthService } from './health.service';
import { CreateHealthRecordDto, UpdateHealthRecordDto } from './dto/health.dto';

@ApiTags('Salud')
@ApiBearerAuth()
@Controller()
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get('dogs/:dogId/health')
  @ApiOperation({ summary: 'Listar registros de salud de un perro' })
  async findByDog(@Param('dogId') dogId: string, @CurrentUser() user: JwtPayload) {
    const records = await this.healthService.findByDog(dogId, user);
    return successResponse(records);
  }

  @Post('dogs/:dogId/health')
  @ApiOperation({ summary: 'Crear registro de salud' })
  async create(
    @Param('dogId') dogId: string,
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateHealthRecordDto,
  ) {
    const record = await this.healthService.create(dogId, user, dto);
    return successResponse(record);
  }

  @Get('dogs/:dogId/health/alerts')
  @ApiOperation({ summary: 'Obtener alertas de vacunas próximas o vencidas' })
  async alerts(@Param('dogId') dogId: string, @CurrentUser() user: JwtPayload) {
    const alerts = await this.healthService.getAlerts(dogId, user);
    return successResponse(alerts);
  }

  @Patch('health/:recordId')
  @ApiOperation({ summary: 'Actualizar registro de salud' })
  async update(
    @Param('recordId') recordId: string,
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdateHealthRecordDto,
  ) {
    const record = await this.healthService.update(recordId, user, dto);
    return successResponse(record);
  }

  @Delete('health/:recordId')
  @ApiOperation({ summary: 'Eliminar registro de salud' })
  async remove(@Param('recordId') recordId: string, @CurrentUser() user: JwtPayload) {
    const result = await this.healthService.remove(recordId, user);
    return successResponse(result);
  }
}
