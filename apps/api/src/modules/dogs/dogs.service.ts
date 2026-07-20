import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdminSubtype, DogStatus, UserRole } from '../../common/enums';
import { JwtPayload } from '../../common/decorators/current-user.decorator';
import { canViewAllDogs, findDogWithAccess } from '../../common/helpers/dog-access.helper';
import { AuditService } from '../admin/audit.service';
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
import { CreateDogDto, UpdateDogDto, UpdateDogPhotoDto } from './dto/dog.dto';
import {
  UpsertBaptismDto,
  UpsertMemorialDto,
  UpsertOriginDto,
  UpsertPreferencesDto,
} from './dto/dog-related.dto';

@Injectable()
export class DogsService {
  constructor(
    @InjectRepository(Dog) private readonly dogRepo: Repository<Dog>,
    @InjectRepository(DogOrigin) private readonly originRepo: Repository<DogOrigin>,
    @InjectRepository(Baptism) private readonly baptismRepo: Repository<Baptism>,
    @InjectRepository(Preferences) private readonly preferencesRepo: Repository<Preferences>,
    @InjectRepository(Memorial) private readonly memorialRepo: Repository<Memorial>,
    @InjectRepository(HealthRecord) private readonly healthRepo: Repository<HealthRecord>,
    @InjectRepository(MealLog) private readonly mealRepo: Repository<MealLog>,
    @InjectRepository(NutritionPlan) private readonly nutritionRepo: Repository<NutritionPlan>,
    @InjectRepository(GrowthRecord) private readonly growthRepo: Repository<GrowthRecord>,
    @InjectRepository(ExerciseLog) private readonly exerciseRepo: Repository<ExerciseLog>,
    @InjectRepository(Memory) private readonly memoryRepo: Repository<Memory>,
    private readonly auditService: AuditService,
  ) {}

  async create(user: JwtPayload, dto: CreateDogDto) {
    if (user.role !== UserRole.OWNER) {
      throw new ForbiddenException('Solo los dueños pueden registrar perros');
    }

    const dog = this.dogRepo.create({
      ownerId: user.sub,
      name: dto.name,
      breedId: dto.breedId ?? null,
      gender: dto.gender,
      birthDate: dto.birthDate,
      birthPlace: dto.birthPlace ?? null,
      photoUrl: dto.photoUrl ?? null,
      status: DogStatus.ACTIVE,
    });

    const saved = await this.dogRepo.save(dog);
    await this.auditService.log(user.sub, 'dog', saved.id, 'create', dto as unknown as Record<string, unknown>);
    return this.findOne(saved.id, user);
  }

  async findAll(user: JwtPayload) {
    const qb = this.dogRepo
      .createQueryBuilder('dog')
      .leftJoinAndSelect('dog.breed', 'breed')
      .leftJoinAndSelect('dog.owner', 'owner')
      .leftJoinAndSelect('owner.profile', 'profile')
      .orderBy('dog.createdAt', 'DESC');

    if (!canViewAllDogs(user)) {
      qb.where('dog.ownerId = :ownerId', { ownerId: user.sub });
    }

    return qb.getMany();
  }

  async findOne(id: string, user: JwtPayload) {
    return findDogWithAccess(this.dogRepo, id, user, {
      relations: ['breed', 'owner', 'owner.profile', 'origin', 'baptism', 'preferences', 'memorial'],
    });
  }

  async update(id: string, user: JwtPayload, dto: UpdateDogDto) {
    const dog = await findDogWithAccess(this.dogRepo, id, user, { requireOwner: true });
    Object.assign(dog, {
      ...(dto.name !== undefined && { name: dto.name }),
      ...(dto.breedId !== undefined && { breedId: dto.breedId }),
      ...(dto.gender !== undefined && { gender: dto.gender }),
      ...(dto.birthDate !== undefined && { birthDate: dto.birthDate }),
      ...(dto.birthPlace !== undefined && { birthPlace: dto.birthPlace }),
      ...(dto.photoUrl !== undefined && { photoUrl: dto.photoUrl }),
    });
    await this.dogRepo.save(dog);
    await this.auditService.log(user.sub, 'dog', id, 'update', dto as unknown as Record<string, unknown>);
    return this.findOne(id, user);
  }

  async remove(id: string, user: JwtPayload) {
    const dog = await findDogWithAccess(this.dogRepo, id, user);
    const isOwner = dog.ownerId === user.sub;
    const isSuperAdmin =
      user.role === UserRole.ADMIN && user.adminSubtype === AdminSubtype.SUPER_ADMIN;

    if (!isOwner && !isSuperAdmin) {
      throw new ForbiddenException('No tienes permisos para eliminar este perro');
    }

    await this.dogRepo.remove(dog);
    await this.auditService.log(user.sub, 'dog', id, 'delete');
    return { message: 'Perro eliminado correctamente' };
  }

  async updatePhoto(id: string, user: JwtPayload, dto: UpdateDogPhotoDto) {
    const dog = await findDogWithAccess(this.dogRepo, id, user, { requireOwner: true });
    dog.photoUrl = dto.photoUrl;
    await this.dogRepo.save(dog);
    return this.findOne(id, user);
  }

  async upsertOrigin(id: string, user: JwtPayload, dto: UpsertOriginDto) {
    await findDogWithAccess(this.dogRepo, id, user, { requireOwner: true });
    let origin = await this.originRepo.findOne({ where: { dogId: id } });
    if (origin) {
      Object.assign(origin, dto);
    } else {
      origin = this.originRepo.create({ dogId: id, ...dto });
    }
    await this.originRepo.save(origin);
    return origin;
  }

  async upsertBaptism(id: string, user: JwtPayload, dto: UpsertBaptismDto) {
    await findDogWithAccess(this.dogRepo, id, user, { requireOwner: true });
    let baptism = await this.baptismRepo.findOne({ where: { dogId: id } });
    if (baptism) {
      Object.assign(baptism, { ...dto, photoUrls: dto.photoUrls ?? baptism.photoUrls });
    } else {
      baptism = this.baptismRepo.create({
        dogId: id,
        ...dto,
        photoUrls: dto.photoUrls ?? [],
      });
    }
    await this.baptismRepo.save(baptism);
    return baptism;
  }

  async upsertPreferences(id: string, user: JwtPayload, dto: UpsertPreferencesDto) {
    await findDogWithAccess(this.dogRepo, id, user, { requireOwner: true });
    let preferences = await this.preferencesRepo.findOne({ where: { dogId: id } });
    if (preferences) {
      Object.assign(preferences, dto);
    } else {
      preferences = this.preferencesRepo.create({ dogId: id, ...dto });
    }
    await this.preferencesRepo.save(preferences);
    return preferences;
  }

  async upsertMemorial(id: string, user: JwtPayload, dto: UpsertMemorialDto) {
    await findDogWithAccess(this.dogRepo, id, user, { requireOwner: true });
    const dog = await this.dogRepo.findOne({ where: { id } });
    if (!dog) {
      throw new NotFoundException('Perro no encontrado');
    }

    dog.status = DogStatus.DECEASED;
    await this.dogRepo.save(dog);

    let memorial = await this.memorialRepo.findOne({ where: { dogId: id } });
    if (memorial) {
      Object.assign(memorial, { ...dto, timelineJson: dto.timelineJson ?? memorial.timelineJson });
    } else {
      memorial = this.memorialRepo.create({
        dogId: id,
        ...dto,
        timelineJson: dto.timelineJson ?? [],
      });
    }
    await this.memorialRepo.save(memorial);
    return memorial;
  }

  async getMemorial(id: string, user: JwtPayload) {
    await findDogWithAccess(this.dogRepo, id, user);
    const memorial = await this.memorialRepo.findOne({ where: { dogId: id } });
    if (!memorial) {
      throw new NotFoundException('Memorial no encontrado');
    }
    return memorial;
  }

  async getTimeline(id: string, user: JwtPayload) {
    const dog = await findDogWithAccess(this.dogRepo, id, user);

    const [health, meals, plans, weights, exercises, memories, origin, baptism, memorial] =
      await Promise.all([
        this.healthRepo.find({ where: { dogId: id }, order: { createdAt: 'DESC' } }),
        this.mealRepo.find({ where: { dogId: id }, order: { loggedAt: 'DESC' } }),
        this.nutritionRepo.find({ where: { dogId: id }, order: { activeFrom: 'DESC' } }),
        this.growthRepo.find({ where: { dogId: id }, order: { recordedAt: 'DESC' } }),
        this.exerciseRepo.find({ where: { dogId: id }, order: { loggedAt: 'DESC' } }),
        this.memoryRepo.find({ where: { dogId: id }, order: { createdAt: 'DESC' } }),
        this.originRepo.findOne({ where: { dogId: id } }),
        this.baptismRepo.findOne({ where: { dogId: id } }),
        this.memorialRepo.findOne({ where: { dogId: id } }),
      ]);

    const events: Array<{
      type: string;
      date: string;
      title: string;
      description?: string;
      metadata?: Record<string, unknown>;
    }> = [];

    events.push({
      type: 'birth',
      date: dog.birthDate,
      title: 'Nacimiento',
      description: `${dog.name} nació${dog.birthPlace ? ` en ${dog.birthPlace}` : ''}`,
    });

    if (origin) {
      events.push({
        type: 'origin',
        date: dog.birthDate,
        title: 'Origen',
        description: origin.sourceName,
        metadata: origin as unknown as Record<string, unknown>,
      });
    }

    if (baptism) {
      events.push({
        type: 'baptism',
        date: baptism.ceremonyDate,
        title: 'Bautizo',
        description: baptism.assignedName,
        metadata: baptism as unknown as Record<string, unknown>,
      });
    }

    health.forEach((record) => {
      events.push({
        type: 'health',
        date: record.appliedDate ?? record.scheduledDate ?? record.createdAt.toISOString().slice(0, 10),
        title: record.title,
        description: record.type,
        metadata: record as unknown as Record<string, unknown>,
      });
    });

    weights.forEach((record) => {
      events.push({
        type: 'weight',
        date: record.recordedAt,
        title: 'Registro de peso',
        description: `${record.weightKg} kg`,
      });
    });

    exercises.forEach((record) => {
      events.push({
        type: 'exercise',
        date: record.loggedAt,
        title: record.activityType,
        description: `${record.durationMinutes} min`,
      });
    });

    meals.forEach((record) => {
      events.push({
        type: 'meal',
        date: record.loggedAt.toISOString().slice(0, 10),
        title: record.mealType,
        description: record.brand ?? undefined,
      });
    });

    plans.forEach((record) => {
      events.push({
        type: 'nutrition_plan',
        date: record.activeFrom,
        title: 'Plan nutricional',
        description: record.lifeStage,
      });
    });

    memories.forEach((record) => {
      events.push({
        type: 'memory',
        date: record.memoryDate ?? record.createdAt.toISOString().slice(0, 10),
        title: record.caption ?? 'Momento memorable',
        metadata: record as unknown as Record<string, unknown>,
      });
    });

    if (memorial) {
      events.push({
        type: 'memorial',
        date: memorial.deathDate,
        title: 'Memorial',
        description: memorial.notes ?? undefined,
        metadata: memorial as unknown as Record<string, unknown>,
      });
    }

    events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return events;
  }
}
