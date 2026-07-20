import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRole } from '../../common/enums';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser, JwtPayload } from '../../common/decorators/current-user.decorator';
import { successResponse } from '../../common/dto/api-response.dto';
import { GrowthService } from './growth.service';
import { CreateExerciseLogDto, CreateGrowthRecordDto } from './dto/growth.dto';

@ApiTags('Crecimiento')
@ApiBearerAuth()
@Roles(UserRole.OWNER)
@Controller('dogs/:dogId/growth')
export class GrowthController {
  constructor(private readonly growthService: GrowthService) {}

  @Get('weight')
  @ApiOperation({ summary: 'Historial de peso' })
  async weights(@Param('dogId') dogId: string, @CurrentUser() user: JwtPayload) {
    const records = await this.growthService.findWeights(dogId, user);
    return successResponse(records);
  }

  @Post('weight')
  @ApiOperation({ summary: 'Registrar peso' })
  async createWeight(
    @Param('dogId') dogId: string,
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateGrowthRecordDto,
  ) {
    const record = await this.growthService.createWeight(dogId, user, dto);
    return successResponse(record);
  }

  @Get('exercise')
  @ApiOperation({ summary: 'Historial de ejercicio' })
  async exercises(@Param('dogId') dogId: string, @CurrentUser() user: JwtPayload) {
    const records = await this.growthService.findExercises(dogId, user);
    return successResponse(records);
  }

  @Post('exercise')
  @ApiOperation({ summary: 'Registrar ejercicio' })
  async createExercise(
    @Param('dogId') dogId: string,
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateExerciseLogDto,
  ) {
    const record = await this.growthService.createExercise(dogId, user, dto);
    return successResponse(record);
  }
}
