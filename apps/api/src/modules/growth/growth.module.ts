import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dog } from '../dogs/entities/dog.entity';
import { GrowthRecord } from './entities/growth-record.entity';
import { ExerciseLog } from './entities/exercise-log.entity';
import { GrowthController } from './growth.controller';
import { GrowthService } from './growth.service';

@Module({
  imports: [TypeOrmModule.forFeature([GrowthRecord, ExerciseLog, Dog])],
  controllers: [GrowthController],
  providers: [GrowthService],
  exports: [GrowthService],
})
export class GrowthModule {}
