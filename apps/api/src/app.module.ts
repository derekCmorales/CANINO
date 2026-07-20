import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAuthGuard } from './modules/auth/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { DogsModule } from './modules/dogs/dogs.module';
import { CatalogsModule } from './modules/catalogs/catalogs.module';
import { HealthModule } from './modules/health/health.module';
import { NutritionModule } from './modules/nutrition/nutrition.module';
import { GrowthModule } from './modules/growth/growth.module';
import { MemoriesModule } from './modules/memories/memories.module';
import { WardrobeModule } from './modules/wardrobe/wardrobe.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { AdminModule } from './modules/admin/admin.module';
import { FilesModule } from './modules/files/files.module';
import { User } from './modules/users/entities/user.entity';
import { UserProfile } from './modules/users/entities/user-profile.entity';
import { Dog } from './modules/dogs/entities/dog.entity';
import { DogOrigin } from './modules/dogs/entities/dog-origin.entity';
import { Baptism } from './modules/dogs/entities/baptism.entity';
import { Preferences } from './modules/dogs/entities/preferences.entity';
import { Memorial } from './modules/dogs/entities/memorial.entity';
import { Breed } from './modules/catalogs/entities/breed.entity';
import { VaccineType } from './modules/catalogs/entities/vaccine-type.entity';
import { HealthRecord } from './modules/health/entities/health-record.entity';
import { NutritionPlan } from './modules/nutrition/entities/nutrition-plan.entity';
import { MealLog } from './modules/nutrition/entities/meal-log.entity';
import { GrowthRecord } from './modules/growth/entities/growth-record.entity';
import { ExerciseLog } from './modules/growth/entities/exercise-log.entity';
import { Memory } from './modules/memories/entities/memory.entity';
import { WardrobeItem } from './modules/wardrobe/entities/wardrobe-item.entity';
import { Notification } from './modules/notifications/entities/notification.entity';
import { NotificationDelivery } from './modules/notifications/entities/notification-delivery.entity';
import { AuditLog } from './modules/admin/entities/audit-log.entity';

const entities = [
  User,
  UserProfile,
  Dog,
  DogOrigin,
  Baptism,
  Preferences,
  Memorial,
  Breed,
  VaccineType,
  HealthRecord,
  NutritionPlan,
  MealLog,
  GrowthRecord,
  ExerciseLog,
  Memory,
  WardrobeItem,
  Notification,
  NotificationDelivery,
  AuditLog,
];

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get<string>('DATABASE_URL'),
        entities,
        synchronize: config.get<string>('NODE_ENV', 'development') !== 'production',
        ssl: config.get<string>('DATABASE_SSL') === 'true' ? { rejectUnauthorized: false } : false,
      }),
    }),
    AuthModule,
    UsersModule,
    DogsModule,
    CatalogsModule,
    HealthModule,
    NutritionModule,
    GrowthModule,
    MemoriesModule,
    WardrobeModule,
    NotificationsModule,
    AdminModule,
    FilesModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
