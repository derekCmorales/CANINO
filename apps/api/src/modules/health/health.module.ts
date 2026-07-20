import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dog } from '../dogs/entities/dog.entity';
import { HealthRecord } from './entities/health-record.entity';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';

@Module({
  imports: [TypeOrmModule.forFeature([HealthRecord, Dog])],
  controllers: [HealthController],
  providers: [HealthService],
  exports: [HealthService, TypeOrmModule],
})
export class HealthModule {}
