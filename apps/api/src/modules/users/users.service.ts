import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdminSubtype, UserRole } from '../../common/enums';
import { User } from './entities/user.entity';
import { UserProfile } from './entities/user-profile.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
import {
  UpdateUserRoleDto,
  UpdateUserStatusDto,
  UpdateWhatsappDto,
} from './dto/user-admin.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(UserProfile) private readonly profileRepo: Repository<UserProfile>,
  ) {}

  async findById(userId: string) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['profile'],
    });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return this.sanitizeUser(user);
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['profile'],
    });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    if (!user.profile) {
      const profile = this.profileRepo.create({
        userId,
        fullName: dto.fullName ?? user.email,
        phone: dto.phone ?? null,
        address: dto.address ?? null,
        avatarUrl: dto.avatarUrl ?? null,
        documentUrl: dto.documentUrl ?? null,
      });
      await this.profileRepo.save(profile);
    } else {
      await this.profileRepo.update(user.profile.id, {
        ...(dto.fullName !== undefined && { fullName: dto.fullName }),
        ...(dto.phone !== undefined && { phone: dto.phone }),
        ...(dto.address !== undefined && { address: dto.address }),
        ...(dto.avatarUrl !== undefined && { avatarUrl: dto.avatarUrl }),
        ...(dto.documentUrl !== undefined && { documentUrl: dto.documentUrl }),
      });
    }

    return this.findById(userId);
  }

  async findAll() {
    const users = await this.userRepo.find({
      relations: ['profile'],
      order: { createdAt: 'DESC' },
    });
    return users.map((user) => this.sanitizeUser(user));
  }

  async updateRole(userId: string, dto: UpdateUserRoleDto) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    if (dto.role === UserRole.ADMIN && !dto.adminSubtype) {
      throw new ForbiddenException('Los administradores requieren un sub-rol');
    }

    user.role = dto.role;
    user.adminSubtype = dto.role === UserRole.ADMIN ? dto.adminSubtype ?? null : null;
    await this.userRepo.save(user);

    return this.findById(userId);
  }

  async updateStatus(userId: string, dto: UpdateUserStatusDto) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    user.isActive = dto.isActive;
    await this.userRepo.save(user);

    return this.findById(userId);
  }

  async updateWhatsapp(userId: string, dto: UpdateWhatsappDto) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['profile'],
    });
    if (!user?.profile) {
      throw new NotFoundException('Perfil de usuario no encontrado');
    }

    if (dto.whatsappOptIn && !user.profile.phone) {
      throw new ForbiddenException('Debes registrar un teléfono antes de activar WhatsApp');
    }

    await this.profileRepo.update(user.profile.id, { whatsappOptIn: dto.whatsappOptIn });
    return this.findById(userId);
  }

  private sanitizeUser(user: User) {
    const { passwordHash, refreshToken, ...safeUser } = user;
    return safeUser;
  }
}
