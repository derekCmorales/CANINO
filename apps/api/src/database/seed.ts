import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import {
  AdminSubtype,
  DogGender,
  DogStatus,
  HealthRecordStatus,
  HealthRecordType,
  LifeStage,
  SourceType,
  UserRole,
} from '../common/enums';
import { User } from '../modules/users/entities/user.entity';
import { UserProfile } from '../modules/users/entities/user-profile.entity';
import { Breed } from '../modules/catalogs/entities/breed.entity';
import { VaccineType } from '../modules/catalogs/entities/vaccine-type.entity';
import { Dog } from '../modules/dogs/entities/dog.entity';
import { DogOrigin } from '../modules/dogs/entities/dog-origin.entity';
import { Baptism } from '../modules/dogs/entities/baptism.entity';
import { Preferences } from '../modules/dogs/entities/preferences.entity';
import { HealthRecord } from '../modules/health/entities/health-record.entity';
import { GrowthRecord } from '../modules/growth/entities/growth-record.entity';
import { NutritionPlan } from '../modules/nutrition/entities/nutrition-plan.entity';
import { Memory } from '../modules/memories/entities/memory.entity';

const entities = [
  User,
  UserProfile,
  Breed,
  VaccineType,
  Dog,
  DogOrigin,
  Baptism,
  Preferences,
  HealthRecord,
  GrowthRecord,
  NutritionPlan,
  Memory,
];

async function seed() {
  const dataSource = new DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    entities,
    synchronize: true,
  });

  await dataSource.initialize();
  console.log('Conectado a la base de datos. Iniciando seed...');

  const userRepo = dataSource.getRepository(User);
  const profileRepo = dataSource.getRepository(UserProfile);
  const breedRepo = dataSource.getRepository(Breed);
  const vaccineRepo = dataSource.getRepository(VaccineType);
  const dogRepo = dataSource.getRepository(Dog);
  const originRepo = dataSource.getRepository(DogOrigin);
  const baptismRepo = dataSource.getRepository(Baptism);
  const preferencesRepo = dataSource.getRepository(Preferences);
  const healthRepo = dataSource.getRepository(HealthRecord);
  const growthRepo = dataSource.getRepository(GrowthRecord);
  const nutritionRepo = dataSource.getRepository(NutritionPlan);
  const memoryRepo = dataSource.getRepository(Memory);

  await dataSource.query(`
    TRUNCATE TABLE
      notification_deliveries,
      notifications,
      audit_logs,
      memories,
      wardrobe_items,
      exercise_logs,
      growth_records,
      meal_logs,
      nutrition_plans,
      health_records,
      memorials,
      preferences,
      baptisms,
      dog_origins,
      dogs,
      vaccine_types,
      breeds,
      user_profiles,
      users
    RESTART IDENTITY CASCADE
  `);

  async function createUser(params: {
    email: string;
    password: string;
    role: UserRole;
    adminSubtype?: AdminSubtype;
    profile: Partial<UserProfile> & { fullName: string };
  }) {
    const user = userRepo.create({
      email: params.email.toLowerCase(),
      passwordHash: await bcrypt.hash(params.password, 10),
      role: params.role,
      adminSubtype: params.adminSubtype ?? null,
      isActive: true,
    });
    const saved = await userRepo.save(user);
    const profile = profileRepo.create({
      userId: saved.id,
      fullName: params.profile.fullName,
      phone: params.profile.phone ?? null,
      address: params.profile.address ?? null,
      whatsappOptIn: params.profile.whatsappOptIn ?? false,
    });
    await profileRepo.save(profile);
    return saved;
  }

  const owner = await createUser({
    email: 'derek@email.com',
    password: 'Demo1234!',
    role: UserRole.OWNER,
    profile: {
      fullName: 'Derek Morales',
      phone: '+50255551234',
      address: 'Ciudad de Guatemala',
      whatsappOptIn: true,
    },
  });

  await createUser({
    email: 'dr.smith@vet.com',
    password: 'Vet1234!',
    role: UserRole.VETERINARIAN,
    profile: { fullName: 'Dr. Smith' },
  });

  await createUser({
    email: 'admin@portal.com',
    password: 'Admin1234!',
    role: UserRole.ADMIN,
    adminSubtype: AdminSubtype.SUPER_ADMIN,
    profile: { fullName: 'Super Admin' },
  });

  await createUser({
    email: 'catalogos@portal.com',
    password: 'Catalog1234!',
    role: UserRole.ADMIN,
    adminSubtype: AdminSubtype.CATALOG_MANAGER,
    profile: { fullName: 'Gestor Catálogos' },
  });

  await createUser({
    email: 'soporte@portal.com',
    password: 'Soporte1234!',
    role: UserRole.ADMIN,
    adminSubtype: AdminSubtype.OPERATIONS,
    profile: { fullName: 'Soporte Operaciones' },
  });

  const breedNames = [
    'Golden Retriever',
    'Beagle',
    'Labrador',
    'Pastor Alemán',
    'Chihuahua',
  ];

  const breeds: Record<string, Breed> = {};
  for (const name of breedNames) {
    const breed = await breedRepo.save(breedRepo.create({ name, isActive: true }));
    breeds[name] = breed;
  }

  const vaccineData = [
    { name: 'Rabia', recommendedIntervalDays: 365 },
    { name: 'Parvovirus', recommendedIntervalDays: 365 },
    { name: 'Moquillo', recommendedIntervalDays: 365 },
    { name: 'Hepatitis', recommendedIntervalDays: 365 },
  ];

  for (const vaccine of vaccineData) {
    await vaccineRepo.save(vaccineRepo.create({ ...vaccine, isActive: true }));
  }

  const rex = await dogRepo.save(
    dogRepo.create({
      ownerId: owner.id,
      name: 'Rex',
      breedId: breeds['Golden Retriever'].id,
      gender: DogGender.MALE,
      birthDate: '2024-05-10',
      birthPlace: 'Antigua Guatemala',
      status: DogStatus.ACTIVE,
    }),
  );

  await originRepo.save(
    originRepo.create({
      dogId: rex.id,
      sourceType: SourceType.BREEDER,
      sourceName: 'Criadero Los Volcanes',
      motherName: 'Bella',
      fatherName: 'Thor',
    }),
  );

  await baptismRepo.save(
    baptismRepo.create({
      dogId: rex.id,
      ceremonyDate: '2024-06-15',
      assignedName: 'Rex',
      notes: 'Ceremonia en el jardín familiar',
      photoUrls: [],
    }),
  );

  await preferencesRepo.save(
    preferencesRepo.create({
      dogId: rex.id,
      likes: 'Nadar, pelotas de tenis',
      favoriteToys: 'Pelota roja',
      favoriteTreats: 'Premios de pollo',
    }),
  );

  await healthRepo.save([
    healthRepo.create({
      dogId: rex.id,
      type: HealthRecordType.VACCINE,
      title: 'Rabia',
      scheduledDate: '2025-05-10',
      appliedDate: '2025-05-12',
      status: HealthRecordStatus.APPLIED,
      batchNumber: 'RAB-2025-001',
    }),
    healthRepo.create({
      dogId: rex.id,
      type: HealthRecordType.VACCINE,
      title: 'Parvovirus',
      scheduledDate: '2026-04-10',
      status: HealthRecordStatus.PENDING,
    }),
  ]);

  await growthRepo.save([
    growthRepo.create({ dogId: rex.id, weightKg: 12.5, recordedAt: '2024-08-01' }),
    growthRepo.create({ dogId: rex.id, weightKg: 28.3, recordedAt: '2025-08-01' }),
  ]);

  await nutritionRepo.save(
    nutritionRepo.create({
      dogId: rex.id,
      lifeStage: LifeStage.PUPPY,
      dietDescription: 'Alimento premium para cachorro, 2 veces al día',
      activeFrom: '2024-05-10',
    }),
  );

  await memoryRepo.save(
    memoryRepo.create({
      dogId: rex.id,
      photoUrl: '/uploads/memories/rex-primer-dia.jpg',
      caption: 'Primer día en casa con la familia',
      memoryDate: '2024-05-15',
      people: 'Derek y familia',
    }),
  );

  const luna = await dogRepo.save(
    dogRepo.create({
      ownerId: owner.id,
      name: 'Luna',
      breedId: breeds.Beagle.id,
      gender: DogGender.FEMALE,
      birthDate: '2025-02-20',
      status: DogStatus.ACTIVE,
    }),
  );

  await healthRepo.save(
    healthRepo.create({
      dogId: luna.id,
      type: HealthRecordType.VACCINE,
      title: 'Parvovirus',
      scheduledDate: '2026-04-10',
      status: HealthRecordStatus.PENDING,
    }),
  );

  await growthRepo.save(
    growthRepo.create({ dogId: luna.id, weightKg: 8.2, recordedAt: '2025-08-01' }),
  );

  console.log('Seed completado exitosamente.');
  console.log('Dueño: derek@email.com / Demo1234!');
  console.log('Veterinario: dr.smith@vet.com / Vet1234!');
  console.log('Admins: admin@portal.com, catalogos@portal.com, soporte@portal.com');

  await dataSource.destroy();
}

seed().catch((error) => {
  console.error('Error ejecutando seed:', error);
  process.exit(1);
});
