import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRole } from '../../common/enums';
import { JwtPayload } from '../../common/decorators/current-user.decorator';
import { findDogWithAccess } from '../../common/helpers/dog-access.helper';
import { Dog } from '../dogs/entities/dog.entity';
import { GrowthRecord } from './entities/growth-record.entity';
import { ExerciseLog } from './entities/exercise-log.entity';
import { CreateExerciseLogDto, CreateGrowthRecordDto } from './dto/growth.dto';

@Injectable()
export class GrowthService {
  constructor(
    @InjectRepository(GrowthRecord) private readonly growthRepo: Repository<GrowthRecord>,
    @InjectRepository(ExerciseLog) private readonly exerciseRepo: Repository<ExerciseLog>,
    @InjectRepository(Dog) private readonly dogRepo: Repository<Dog>,
  ) {}

  private assertOwner(user: JwtPayload) {
    if (user.role !== UserRole.OWNER) {
      throw new ForbiddenException('Solo el dueño puede gestionar crecimiento');
    }
  }

  async findWeights(dogId: string, user: JwtPayload) {
    this.assertOwner(user);
    await findDogWithAccess(this.dogRepo, dogId, user, { requireOwner: true });
    return this.growthRepo.find({ where: { dogId }, order: { recordedAt: 'ASC' } });
  }

  async createWeight(dogId: string, user: JwtPayload, dto: CreateGrowthRecordDto) {
    this.assertOwner(user);
    await findDogWithAccess(this.dogRepo, dogId, user, { requireOwner: true });
    const record = this.growthRepo.create({ dogId, ...dto });
    return this.growthRepo.save(record);
  }

  async findExercises(dogId: string, user: JwtPayload) {
    this.assertOwner(user);
    await findDogWithAccess(this.dogRepo, dogId, user, { requireOwner: true });
    return this.exerciseRepo.find({ where: { dogId }, order: { loggedAt: 'DESC' } });
  }

  async createExercise(dogId: string, user: JwtPayload, dto: CreateExerciseLogDto) {
    this.assertOwner(user);
    await findDogWithAccess(this.dogRepo, dogId, user, { requireOwner: true });
    const record = this.exerciseRepo.create({ dogId, ...dto });
    return this.exerciseRepo.save(record);
  }
}
