import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminModule } from '../admin/admin.module';
import { HealthRecord } from '../health/entities/health-record.entity';
import { MealLog } from '../nutrition/entities/meal-log.entity';
import { NutritionPlan } from '../nutrition/entities/nutrition-plan.entity';
import { GrowthRecord } from '../growth/entities/growth-record.entity';
import { ExerciseLog } from '../growth/entities/exercise-log.entity';
import { Memory } from '../memories/entities/memory.entity';
import { Dog } from './entities/dog.entity';
import { DogOrigin } from './entities/dog-origin.entity';
import { Baptism } from './entities/baptism.entity';
import { Preferences } from './entities/preferences.entity';
import { Memorial } from './entities/memorial.entity';
import { DogsController } from './dogs.controller';
import { DogsService } from './dogs.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Dog,
      DogOrigin,
      Baptism,
      Preferences,
      Memorial,
      HealthRecord,
      MealLog,
      NutritionPlan,
      GrowthRecord,
      ExerciseLog,
      Memory,
    ]),
    forwardRef(() => AdminModule),
  ],
  controllers: [DogsController],
  providers: [DogsService],
  exports: [DogsService, TypeOrmModule],
})
export class DogsModule {}
