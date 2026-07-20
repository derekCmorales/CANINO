import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DogStatus, UserRole } from '../../common/enums';
import { User } from '../users/entities/user.entity';
import { Dog } from '../dogs/entities/dog.entity';
import { HealthRecord } from '../health/entities/health-record.entity';
import { Notification } from '../notifications/entities/notification.entity';
import { AuditService } from './audit.service';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Dog) private readonly dogRepo: Repository<Dog>,
    @InjectRepository(HealthRecord) private readonly healthRepo: Repository<HealthRecord>,
    @InjectRepository(Notification) private readonly notificationRepo: Repository<Notification>,
    private readonly auditService: AuditService,
  ) {}

  async getStats() {
    const [users, dogs, activeDogs, deceasedDogs, healthRecords, notifications] =
      await Promise.all([
        this.userRepo.count(),
        this.dogRepo.count(),
        this.dogRepo.count({ where: { status: DogStatus.ACTIVE } }),
        this.dogRepo.count({ where: { status: DogStatus.DECEASED } }),
        this.healthRepo.count(),
        this.notificationRepo.count(),
      ]);

    const owners = await this.userRepo.count({ where: { role: UserRole.OWNER } });
    const veterinarians = await this.userRepo.count({ where: { role: UserRole.VETERINARIAN } });
    const admins = await this.userRepo.count({ where: { role: UserRole.ADMIN } });

    return {
      users: { total: users, owners, veterinarians, admins },
      dogs: { total: dogs, active: activeDogs, deceased: deceasedDogs },
      healthRecords,
      notifications,
    };
  }

  getAuditLogs(limit?: number) {
    return this.auditService.findAll(limit);
  }
}
