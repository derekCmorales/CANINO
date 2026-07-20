import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthRecord } from '../health/entities/health-record.entity';
import { Dog } from '../dogs/entities/dog.entity';
import { Notification } from './entities/notification.entity';
import { NotificationDelivery } from './entities/notification-delivery.entity';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { WhatsappService } from './whatsapp.service';
import { VaccineCronService } from './vaccine-cron.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification, NotificationDelivery, HealthRecord, Dog]),
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService, WhatsappService, VaccineCronService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
