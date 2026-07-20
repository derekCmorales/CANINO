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

export enum InsurancePolicyStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
}

export enum InsuranceClaimStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
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

export enum DeliveryChannel {
  IN_APP = 'in_app',
  WHATSAPP = 'whatsapp',
}

export enum DeliveryStatus {
  PENDING = 'pending',
  SENT = 'sent',
  FAILED = 'failed',
  MOCK = 'mock',
}
