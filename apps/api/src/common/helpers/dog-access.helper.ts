import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserRole } from '../enums';
import { JwtPayload } from '../decorators/current-user.decorator';
import { Dog } from '../../modules/dogs/entities/dog.entity';

export function canViewAllDogs(user: JwtPayload): boolean {
  return user.role === UserRole.VETERINARIAN || user.role === UserRole.ADMIN;
}

export async function findDogWithAccess(
  dogRepo: Repository<Dog>,
  dogId: string,
  user: JwtPayload,
  options?: { requireOwner?: boolean; relations?: string[] },
): Promise<Dog> {
  const dog = await dogRepo.findOne({
    where: { id: dogId },
    relations: options?.relations ?? ['breed', 'owner', 'owner.profile'],
  });

  if (!dog) {
    throw new NotFoundException('Perro no encontrado');
  }

  const isOwner = dog.ownerId === user.sub;
  const canViewAll = canViewAllDogs(user);

  if (options?.requireOwner && !isOwner) {
    throw new ForbiddenException('Solo el dueño puede realizar esta acción');
  }

  if (!isOwner && !canViewAll) {
    throw new ForbiddenException('No tienes acceso a este perro');
  }

  return dog;
}
