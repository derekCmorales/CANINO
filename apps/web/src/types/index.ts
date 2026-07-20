export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T | null;
  error?: string | null;
  meta?: Record<string, unknown>;
}

export enum UserRole {
  OWNER = 'owner',
  VETERINARIAN = 'veterinarian',
  ADMIN = 'admin',
}

export enum AdminSubtype {
  SUPER_ADMIN = 'super_admin',
  CATALOG_MANAGER = 'catalog_manager',
  OPERATIONS = 'operations',
}

export enum DogGender {
  MALE = 'male',
  FEMALE = 'female',
}

export enum DogStatus {
  ACTIVE = 'active',
  DECEASED = 'deceased',
}

export enum HealthRecordType {
  VACCINE = 'vaccine',
  CONSULTATION = 'consultation',
  MEDICATION = 'medication',
  ALLERGY = 'allergy',
}

export enum HealthRecordStatus {
  PENDING = 'pending',
  APPLIED = 'applied',
  OVERDUE = 'overdue',
}

export enum LifeStage {
  PUPPY = 'puppy',
  ADULT = 'adult',
  SENIOR = 'senior',
}

export enum ExerciseIntensity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export enum WardrobeItemType {
  CLOTHING = 'clothing',
  COLLAR = 'collar',
  LEASH = 'leash',
  TAG = 'tag',
  OTHER = 'other',
}

export enum SourceType {
  BREEDER = 'breeder',
  SHELTER = 'shelter',
  OTHER = 'other',
}

export enum NotificationType {
  VACCINE_DUE = 'vaccine_due',
  VACCINE_OVERDUE = 'vaccine_overdue',
  SYSTEM = 'system',
}

export enum AuditAction {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
}

export interface UserProfile {
  id: string;
  userId: string;
  fullName: string;
  phone?: string | null;
  address?: string | null;
  documentUrl?: string | null;
  avatarUrl?: string | null;
  whatsappOptIn: boolean;
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  adminSubtype?: AdminSubtype | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  profile?: UserProfile;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export interface Breed {
  id: string;
  name: string;
  sizeCategory?: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface VaccineType {
  id: string;
  name: string;
  recommendedIntervalDays: number;
  isActive: boolean;
  createdAt: string;
}

export interface Dog {
  id: string;
  ownerId: string;
  name: string;
  breedId?: string | null;
  breed?: Breed | null;
  gender: DogGender;
  birthDate: string;
  birthPlace?: string | null;
  photoUrl?: string | null;
  status: DogStatus;
  createdAt: string;
  origin?: DogOrigin;
  baptism?: Baptism;
  preferences?: Preferences;
  memorial?: Memorial;
  owner?: User;
}

export interface DogOrigin {
  dogId: string;
  sourceType: SourceType;
  sourceName: string;
  motherName?: string | null;
  fatherName?: string | null;
  notes?: string | null;
}

export interface Baptism {
  id: string;
  dogId: string;
  ceremonyDate: string;
  assignedName: string;
  notes?: string | null;
  photoUrls: string[];
}

export interface Preferences {
  dogId: string;
  likes: string;
  favoriteToys?: string | null;
  favoriteActivities?: string | null;
  favoriteTreats?: string | null;
}

export interface Memorial {
  id: string;
  dogId: string;
  deathDate: string;
  cause?: string | null;
  notes?: string | null;
  burialPlace?: string | null;
  burialAddress?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  contactInfo?: string | null;
  timelineJson: unknown[];
}

export interface TimelineEvent {
  type:
    | 'birth'
    | 'origin'
    | 'baptism'
    | 'health'
    | 'weight'
    | 'exercise'
    | 'meal'
    | 'nutrition_plan'
    | 'memory'
    | 'memorial';
  date: string;
  title: string;
  description?: string;
  metadata?: Record<string, unknown>;
}

export interface HealthRecord {
  id: string;
  dogId: string;
  type: HealthRecordType;
  title: string;
  scheduledDate?: string | null;
  appliedDate?: string | null;
  status: HealthRecordStatus;
  veterinarianId?: string | null;
  batchNumber?: string | null;
  diagnosis?: string | null;
  medication?: string | null;
  notes?: string | null;
  createdAt: string;
}

export interface VaccineAlerts {
  dueSoon: HealthRecord[];
  overdue: HealthRecord[];
}

export interface NutritionPlan {
  id: string;
  dogId: string;
  lifeStage: LifeStage;
  dietDescription: string;
  restrictions?: string | null;
  favoriteFood?: string | null;
  activeFrom: string;
  activeTo?: string | null;
}

export interface MealLog {
  id: string;
  dogId: string;
  mealType: string;
  brand?: string | null;
  portion?: string | null;
  loggedAt: string;
}

export interface GrowthRecord {
  id: string;
  dogId: string;
  weightKg: number | string;
  recordedAt: string;
}

export interface ExerciseLog {
  id: string;
  dogId: string;
  activityType: string;
  durationMinutes: number;
  intensity: ExerciseIntensity;
  loggedAt: string;
  notes?: string | null;
}

export interface Memory {
  id: string;
  dogId: string;
  photoUrl: string;
  caption?: string | null;
  memoryDate?: string | null;
  people?: string | null;
  createdAt: string;
}

export interface WardrobeItem {
  id: string;
  dogId: string;
  itemType: WardrobeItemType;
  name: string;
  size?: string | null;
  color?: string | null;
  photoUrl?: string | null;
  isFavorite: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  dogId?: string | null;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  entity: string;
  entityId: string;
  action: AuditAction;
  changes?: Record<string, unknown> | null;
  createdAt: string;
}

export interface AdminStats {
  users: {
    total: number;
    owners: number;
    veterinarians: number;
    admins: number;
  };
  dogs: { total: number; active: number; deceased: number };
  healthRecords: number;
  notifications: number;
}

export interface UploadedFile {
  filename: string;
  path: string;
  originalName: string;
  size: number;
  mimeType: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  address?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface UpdateProfileDto {
  fullName?: string;
  phone?: string;
  address?: string;
  avatarUrl?: string;
  documentUrl?: string;
}

export interface CreateDogDto {
  name: string;
  breedId?: string;
  gender: DogGender;
  birthDate: string;
  birthPlace?: string;
  photoUrl?: string;
}

export interface CreateHealthRecordDto {
  type: HealthRecordType;
  title: string;
  scheduledDate?: string;
  appliedDate?: string;
  status?: HealthRecordStatus;
  batchNumber?: string;
  diagnosis?: string;
  medication?: string;
  notes?: string;
}

export interface CreateNutritionPlanDto {
  lifeStage: LifeStage;
  dietDescription: string;
  restrictions?: string;
  favoriteFood?: string;
  activeFrom: string;
  activeTo?: string;
}

export interface CreateMealLogDto {
  mealType: string;
  brand?: string;
  portion?: string;
}

export interface CreateGrowthRecordDto {
  weightKg: number;
  recordedAt: string;
}

export interface CreateExerciseLogDto {
  activityType: string;
  durationMinutes: number;
  intensity: ExerciseIntensity;
  loggedAt: string;
  notes?: string;
}

export interface CreateMemoryDto {
  photoUrl: string;
  caption?: string;
  memoryDate?: string;
  people?: string;
}

export interface CreateWardrobeItemDto {
  itemType: WardrobeItemType;
  name: string;
  size?: string;
  color?: string;
  photoUrl?: string;
  isFavorite?: boolean;
}

export interface UpsertOriginDto {
  sourceType: SourceType;
  sourceName: string;
  motherName?: string;
  fatherName?: string;
  notes?: string;
}

export interface UpsertBaptismDto {
  ceremonyDate: string;
  assignedName: string;
  notes?: string;
  photoUrls?: string[];
}

export interface UpsertPreferencesDto {
  likes: string;
  favoriteToys?: string;
  favoriteActivities?: string;
  favoriteTreats?: string;
}

export interface UpsertMemorialDto {
  deathDate: string;
  cause?: string;
  notes?: string;
  burialPlace?: string;
  burialAddress?: string;
  latitude?: number;
  longitude?: number;
  contactInfo?: string;
  timelineJson?: unknown[];
}

export interface CreateBreedDto {
  name: string;
  sizeCategory?: string;
}

export interface CreateVaccineTypeDto {
  name: string;
  recommendedIntervalDays?: number;
}

export interface UpdateUserRoleDto {
  role: UserRole;
  adminSubtype?: AdminSubtype;
}

export const LABELS = {
  gender: { male: 'Macho', female: 'Hembra' } as Record<DogGender, string>,
  dogStatus: { active: 'Activo', deceased: 'Fallecido' } as Record<DogStatus, string>,
  healthType: {
    vaccine: 'Vacuna',
    consultation: 'Consulta',
    medication: 'Medicamento',
    allergy: 'Alergia',
  } as Record<HealthRecordType, string>,
  healthStatus: {
    pending: 'Pendiente',
    applied: 'Aplicada',
    overdue: 'Vencida',
  } as Record<HealthRecordStatus, string>,
  lifeStage: { puppy: 'Cachorro', adult: 'Adulto', senior: 'Senior' } as Record<LifeStage, string>,
  exerciseIntensity: {
    low: 'Baja',
    medium: 'Media',
    high: 'Alta',
  } as Record<ExerciseIntensity, string>,
  wardrobeType: {
    clothing: 'Ropa',
    collar: 'Collar',
    leash: 'Correa',
    tag: 'Placa',
    other: 'Otro',
  } as Record<WardrobeItemType, string>,
  sourceType: {
    breeder: 'Criador',
    shelter: 'Refugio',
    other: 'Otro',
  } as Record<SourceType, string>,
  userRole: {
    owner: 'Dueño',
    veterinarian: 'Veterinario',
    admin: 'Administrador',
  } as Record<UserRole, string>,
  adminSubtype: {
    super_admin: 'Super Admin',
    catalog_manager: 'Gestor de catálogos',
    operations: 'Operaciones',
  } as Record<AdminSubtype, string>,
  notificationType: {
    vaccine_due: 'Vacuna próxima',
    vaccine_overdue: 'Vacuna vencida',
    system: 'Sistema',
  } as Record<NotificationType, string>,
  auditAction: {
    create: 'Creación',
    update: 'Actualización',
    delete: 'Eliminación',
  } as Record<AuditAction, string>,
};
