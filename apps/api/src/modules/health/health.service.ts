import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  HealthRecordStatus,
  HealthRecordType,
  UserRole,
} from '../../common/enums';
import { JwtPayload } from '../../common/decorators/current-user.decorator';
import { findDogWithAccess } from '../../common/helpers/dog-access.helper';
import { Dog } from '../dogs/entities/dog.entity';
import { HealthRecord } from './entities/health-record.entity';
import { CreateHealthRecordDto, UpdateHealthRecordDto } from './dto/health.dto';

@Injectable()
export class HealthService {
  constructor(
    @InjectRepository(HealthRecord) private readonly healthRepo: Repository<HealthRecord>,
    @InjectRepository(Dog) private readonly dogRepo: Repository<Dog>,
  ) {}

  async findByDog(dogId: string, user: JwtPayload) {
    await findDogWithAccess(this.dogRepo, dogId, user);
    return this.healthRepo.find({
      where: { dogId },
      order: { scheduledDate: 'DESC', createdAt: 'DESC' },
    });
  }

  async create(dogId: string, user: JwtPayload, dto: CreateHealthRecordDto) {
    await findDogWithAccess(this.dogRepo, dogId, user);

    const canWrite =
      user.role === UserRole.OWNER ||
      user.role === UserRole.VETERINARIAN ||
      user.role === UserRole.ADMIN;

    if (!canWrite) {
      throw new ForbiddenException('No tienes permisos para registrar salud');
    }

    const record = this.healthRepo.create({
      dogId,
      type: dto.type,
      title: dto.title,
      scheduledDate: dto.scheduledDate ?? null,
      appliedDate: dto.appliedDate ?? null,
      status: dto.status ?? HealthRecordStatus.PENDING,
      veterinarianId: user.role === UserRole.VETERINARIAN ? user.sub : null,
      batchNumber: dto.batchNumber ?? null,
      diagnosis: dto.diagnosis ?? null,
      medication: dto.medication ?? null,
      notes: dto.notes ?? null,
    });

    return this.healthRepo.save(record);
  }

  async update(recordId: string, user: JwtPayload, dto: UpdateHealthRecordDto) {
    const record = await this.findRecord(recordId);
    await this.assertWriteAccess(record.dogId, user);

    Object.assign(record, {
      ...(dto.type !== undefined && { type: dto.type }),
      ...(dto.title !== undefined && { title: dto.title }),
      ...(dto.scheduledDate !== undefined && { scheduledDate: dto.scheduledDate }),
      ...(dto.appliedDate !== undefined && { appliedDate: dto.appliedDate }),
      ...(dto.status !== undefined && { status: dto.status }),
      ...(dto.veterinarianId !== undefined && { veterinarianId: dto.veterinarianId }),
      ...(dto.batchNumber !== undefined && { batchNumber: dto.batchNumber }),
      ...(dto.diagnosis !== undefined && { diagnosis: dto.diagnosis }),
      ...(dto.medication !== undefined && { medication: dto.medication }),
      ...(dto.notes !== undefined && { notes: dto.notes }),
    });

    if (dto.status === HealthRecordStatus.APPLIED && !record.appliedDate) {
      record.appliedDate = new Date().toISOString().slice(0, 10);
    }

    return this.healthRepo.save(record);
  }

  async remove(recordId: string, user: JwtPayload) {
    const record = await this.findRecord(recordId);
    const dog = await findDogWithAccess(this.dogRepo, record.dogId, user);

    const isOwner = dog.ownerId === user.sub;
    const isAdmin = user.role === UserRole.ADMIN;

    if (!isOwner && !isAdmin) {
      throw new ForbiddenException('No tienes permisos para eliminar este registro');
    }

    await this.healthRepo.remove(record);
    return { message: 'Registro de salud eliminado' };
  }

  async getAlerts(dogId: string, user: JwtPayload) {
    await findDogWithAccess(this.dogRepo, dogId, user, { requireOwner: true });

    const today = new Date();
    const inSevenDays = new Date();
    inSevenDays.setDate(today.getDate() + 7);

    const records = await this.healthRepo.find({
      where: { dogId, type: HealthRecordType.VACCINE },
      order: { scheduledDate: 'ASC' },
    });

    const dueSoon = records.filter((record) => {
      if (!record.scheduledDate || record.status === HealthRecordStatus.APPLIED) {
        return false;
      }
      const scheduled = new Date(record.scheduledDate);
      return scheduled >= today && scheduled <= inSevenDays;
    });

    const overdue = records.filter((record) => {
      if (!record.scheduledDate || record.status === HealthRecordStatus.APPLIED) {
        return false;
      }
      const scheduled = new Date(record.scheduledDate);
      return scheduled < today;
    });

    return { dueSoon, overdue };
  }

  private async findRecord(recordId: string) {
    const record = await this.healthRepo.findOne({ where: { id: recordId } });
    if (!record) {
      throw new NotFoundException('Registro de salud no encontrado');
    }
    return record;
  }

  private async assertWriteAccess(dogId: string, user: JwtPayload) {
    const dog = await findDogWithAccess(this.dogRepo, dogId, user);
    const isOwner = dog.ownerId === user.sub;
    const isVet = user.role === UserRole.VETERINARIAN;
    const isAdmin = user.role === UserRole.ADMIN;

    if (!isOwner && !isVet && !isAdmin) {
      throw new ForbiddenException('No tienes permisos para modificar salud');
    }
  }
}
