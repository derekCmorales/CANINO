import { SetMetadata } from '@nestjs/common';
import { UserRole, AdminSubtype } from '../enums';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);

export const ADMIN_SUBTYPES_KEY = 'admin_subtypes';
export const AdminSubtypes = (...subtypes: AdminSubtype[]) =>
  SetMetadata(ADMIN_SUBTYPES_KEY, subtypes);

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
