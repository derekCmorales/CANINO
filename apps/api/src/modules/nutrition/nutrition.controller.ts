import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRole } from '../../common/enums';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser, JwtPayload } from '../../common/decorators/current-user.decorator';
import { successResponse } from '../../common/dto/api-response.dto';
import { NutritionService } from './nutrition.service';
import { CreateMealLogDto, CreateNutritionPlanDto } from './dto/nutrition.dto';

@ApiTags('Nutrición')
@ApiBearerAuth()
@Roles(UserRole.OWNER)
@Controller('dogs/:dogId/nutrition')
export class NutritionController {
  constructor(private readonly nutritionService: NutritionService) {}

  @Get('plans')
  @ApiOperation({ summary: 'Listar planes nutricionales' })
  async plans(@Param('dogId') dogId: string, @CurrentUser() user: JwtPayload) {
    const plans = await this.nutritionService.findPlans(dogId, user);
    return successResponse(plans);
  }

  @Post('plans')
  @ApiOperation({ summary: 'Crear plan nutricional' })
  async createPlan(
    @Param('dogId') dogId: string,
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateNutritionPlanDto,
  ) {
    const plan = await this.nutritionService.createPlan(dogId, user, dto);
    return successResponse(plan);
  }

  @Get('meals')
  @ApiOperation({ summary: 'Historial de comidas' })
  async meals(@Param('dogId') dogId: string, @CurrentUser() user: JwtPayload) {
    const meals = await this.nutritionService.findMeals(dogId, user);
    return successResponse(meals);
  }

  @Post('meals')
  @ApiOperation({ summary: 'Registrar comida' })
  async createMeal(
    @Param('dogId') dogId: string,
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateMealLogDto,
  ) {
    const meal = await this.nutritionService.createMeal(dogId, user, dto);
    return successResponse(meal);
  }
}
