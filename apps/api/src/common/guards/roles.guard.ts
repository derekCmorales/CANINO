import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY, ADMIN_SUBTYPES_KEY, IS_PUBLIC_KEY } from '../decorators/roles.decorator';
import { UserRole, AdminSubtype } from '../enums';
import { JwtPayload } from '../decorators/current-user.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const requiredSubtypes = this.reflector.getAllAndOverride<AdminSubtype[]>(
      ADMIN_SUBTYPES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles?.length && !requiredSubtypes?.length) return true;

    const { user } = context.switchToHttp().getRequest<{ user: JwtPayload }>();
    if (!user) throw new ForbiddenException('Acceso denegado');

    if (requiredRoles?.length && !requiredRoles.includes(user.role as UserRole)) {
      throw new ForbiddenException('No tienes permisos para esta acción');
    }

    if (requiredSubtypes?.length) {
      if (user.role !== UserRole.ADMIN) {
        throw new ForbiddenException('Se requiere rol de administrador');
      }
      if (!user.adminSubtype || !requiredSubtypes.includes(user.adminSubtype as AdminSubtype)) {
        throw new ForbiddenException('Sub-rol de administrador insuficiente');
      }
    }

    return true;
  }
}
