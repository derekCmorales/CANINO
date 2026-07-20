import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Dog } from '../dogs/entities/dog.entity';
import { HealthRecord } from '../health/entities/health-record.entity';
import { Notification } from '../notifications/entities/notification.entity';
import { AuditLog } from './entities/audit-log.entity';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AuditService } from './audit.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([AuditLog, User, Dog, HealthRecord, Notification]),
  ],
  controllers: [AdminController],
  providers: [AdminService, AuditService],
  exports: [AuditService],
})
export class AdminModule {}
