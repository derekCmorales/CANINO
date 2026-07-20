import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  DeliveryChannel,
  DeliveryStatus,
  HealthRecordStatus,
  HealthRecordType,
  NotificationType,
} from '../../common/enums';
import { HealthRecord } from '../health/entities/health-record.entity';
import { Dog } from '../dogs/entities/dog.entity';
import { Notification } from './entities/notification.entity';
import { NotificationDelivery } from './entities/notification-delivery.entity';
import { WhatsappService } from './whatsapp.service';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification) private readonly notificationRepo: Repository<Notification>,
    @InjectRepository(NotificationDelivery)
    private readonly deliveryRepo: Repository<NotificationDelivery>,
    @InjectRepository(HealthRecord) private readonly healthRepo: Repository<HealthRecord>,
    @InjectRepository(Dog) private readonly dogRepo: Repository<Dog>,
    private readonly whatsappService: WhatsappService,
  ) {}

  async findMine(userId: string) {
    return this.notificationRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      relations: ['dog'],
    });
  }

  async markAsRead(notificationId: string, userId: string) {
    const notification = await this.notificationRepo.findOne({
      where: { id: notificationId, userId },
    });
    if (!notification) {
      throw new NotFoundException('Notificación no encontrada');
    }
    notification.isRead = true;
    return this.notificationRepo.save(notification);
  }

  async processVaccineAlerts() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const inSevenDays = new Date(today);
    inSevenDays.setDate(today.getDate() + 7);

    const records = await this.healthRepo.find({
      where: {
        type: HealthRecordType.VACCINE,
        status: HealthRecordStatus.PENDING,
      },
      relations: ['dog', 'dog.owner', 'dog.owner.profile'],
    });

    let processed = 0;

    for (const record of records) {
      if (!record.scheduledDate || !record.dog) {
        continue;
      }

      const scheduled = new Date(record.scheduledDate);
      scheduled.setHours(0, 0, 0, 0);

      const isDueSoon = scheduled >= today && scheduled <= inSevenDays;
      const isOverdue = scheduled < today;

      if (!isDueSoon && !isOverdue) {
        continue;
      }

      const type = isOverdue ? NotificationType.VACCINE_OVERDUE : NotificationType.VACCINE_DUE;
      const title = isOverdue ? 'Vacuna vencida' : 'Vacuna próxima';
      const message =
        `La vacuna ${record.title} de ${record.dog.name} ` +
        `${isOverdue ? 'está vencida' : 'vence pronto'} (${record.scheduledDate}).`;

      const existing = await this.notificationRepo
        .createQueryBuilder('n')
        .where('n.userId = :userId', { userId: record.dog.ownerId })
        .andWhere('n.dogId = :dogId', { dogId: record.dogId })
        .andWhere('n.type = :type', { type })
        .andWhere('n.message LIKE :search', { search: `%${record.title}%` })
        .andWhere('n.createdAt >= :since', {
          since: new Date(Date.now() - 24 * 60 * 60 * 1000),
        })
        .getOne();

      if (existing) {
        continue;
      }

      const notification = await this.notificationRepo.save(
        this.notificationRepo.create({
          userId: record.dog.ownerId,
          dogId: record.dogId,
          type,
          title,
          message,
          isRead: false,
        }),
      );

      await this.deliveryRepo.save(
        this.deliveryRepo.create({
          notificationId: notification.id,
          channel: DeliveryChannel.IN_APP,
          status: DeliveryStatus.SENT,
          sentAt: new Date(),
        }),
      );

      const owner = record.dog.owner;
      const profile = owner?.profile;

      if (profile?.whatsappOptIn && profile.phone) {
        const result = await this.whatsappService.sendVaccineReminder({
          to: profile.phone,
          ownerName: profile.fullName,
          dogName: record.dog.name,
          vaccineName: record.title,
          scheduledDate: record.scheduledDate,
        });

        await this.deliveryRepo.save(
          this.deliveryRepo.create({
            notificationId: notification.id,
            channel: DeliveryChannel.WHATSAPP,
            status:
              result.status === 'mock'
                ? DeliveryStatus.MOCK
                : result.status === 'sent'
                  ? DeliveryStatus.SENT
                  : DeliveryStatus.FAILED,
            externalId: result.externalId ?? null,
            sentAt: new Date(),
            errorMessage: result.error ?? null,
          }),
        );
      }

      if (isOverdue && record.status !== HealthRecordStatus.OVERDUE) {
        record.status = HealthRecordStatus.OVERDUE;
        await this.healthRepo.save(record);
      }

      processed += 1;
    }

    return { processed };
  }
}
