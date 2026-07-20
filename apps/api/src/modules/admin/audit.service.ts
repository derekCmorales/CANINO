import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditAction } from '../../common/enums';
import { AuditLog } from './entities/audit-log.entity';

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog) private readonly auditRepo: Repository<AuditLog>,
  ) {}

  async log(
    userId: string,
    entity: string,
    entityId: string,
    action: AuditAction | `${AuditAction}`,
    changes?: Record<string, unknown> | null,
  ) {
    const entry = this.auditRepo.create({
      userId,
      entity,
      entityId,
      action: action as AuditAction,
      changes: changes ?? null,
    });
    return this.auditRepo.save(entry);
  }

  async findAll(limit = 100) {
    return this.auditRepo.find({
      relations: ['user', 'user.profile'],
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }
}
