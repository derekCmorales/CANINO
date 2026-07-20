import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRole } from '../../common/enums';
import { JwtPayload } from '../../common/decorators/current-user.decorator';
import { findDogWithAccess } from '../../common/helpers/dog-access.helper';
import { Dog } from '../dogs/entities/dog.entity';
import { NutritionPlan } from './entities/nutrition-plan.entity';
import { MealLog } from './entities/meal-log.entity';
import { CreateMealLogDto, CreateNutritionPlanDto } from './dto/nutrition.dto';

@Injectable()
export class NutritionService {
  constructor(
    @InjectRepository(NutritionPlan) private readonly planRepo: Repository<NutritionPlan>,
    @InjectRepository(MealLog) private readonly mealRepo: Repository<MealLog>,
    @InjectRepository(Dog) private readonly dogRepo: Repository<Dog>,
  ) {}

  private assertOwner(user: JwtPayload) {
    if (user.role !== UserRole.OWNER) {
      throw new ForbiddenException('Solo el dueño puede gestionar nutrición');
    }
  }

  async findPlans(dogId: string, user: JwtPayload) {
    this.assertOwner(user);
    await findDogWithAccess(this.dogRepo, dogId, user, { requireOwner: true });
    return this.planRepo.find({ where: { dogId }, order: { activeFrom: 'DESC' } });
  }

  async createPlan(dogId: string, user: JwtPayload, dto: CreateNutritionPlanDto) {
    this.assertOwner(user);
    await findDogWithAccess(this.dogRepo, dogId, user, { requireOwner: true });
    const plan = this.planRepo.create({ dogId, ...dto });
    return this.planRepo.save(plan);
  }

  async findMeals(dogId: string, user: JwtPayload) {
    this.assertOwner(user);
    await findDogWithAccess(this.dogRepo, dogId, user, { requireOwner: true });
    return this.mealRepo.find({ where: { dogId }, order: { loggedAt: 'DESC' } });
  }

  async createMeal(dogId: string, user: JwtPayload, dto: CreateMealLogDto) {
    this.assertOwner(user);
    await findDogWithAccess(this.dogRepo, dogId, user, { requireOwner: true });
    const meal = this.mealRepo.create({ dogId, ...dto, loggedAt: new Date() });
    return this.mealRepo.save(meal);
  }
}
