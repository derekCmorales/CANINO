import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRole } from '../../common/enums';
import { JwtPayload } from '../../common/decorators/current-user.decorator';
import { findDogWithAccess } from '../../common/helpers/dog-access.helper';
import { Dog } from '../dogs/entities/dog.entity';
import { WardrobeItem } from './entities/wardrobe-item.entity';
import { CreateWardrobeItemDto, UpdateWardrobeItemDto } from './dto/wardrobe.dto';

@Injectable()
export class WardrobeService {
  constructor(
    @InjectRepository(WardrobeItem) private readonly wardrobeRepo: Repository<WardrobeItem>,
    @InjectRepository(Dog) private readonly dogRepo: Repository<Dog>,
  ) {}

  private assertOwner(user: JwtPayload) {
    if (user.role !== UserRole.OWNER) {
      throw new ForbiddenException('Solo el dueño puede gestionar ropa y accesorios');
    }
  }

  async findAll(dogId: string, user: JwtPayload) {
    this.assertOwner(user);
    await findDogWithAccess(this.dogRepo, dogId, user, { requireOwner: true });
    return this.wardrobeRepo.find({ where: { dogId }, order: { name: 'ASC' } });
  }

  async create(dogId: string, user: JwtPayload, dto: CreateWardrobeItemDto) {
    this.assertOwner(user);
    await findDogWithAccess(this.dogRepo, dogId, user, { requireOwner: true });
    const item = this.wardrobeRepo.create({
      dogId,
      ...dto,
      isFavorite: dto.isFavorite ?? false,
    });
    return this.wardrobeRepo.save(item);
  }

  async update(itemId: string, user: JwtPayload, dto: UpdateWardrobeItemDto) {
    this.assertOwner(user);
    const item = await this.findItem(itemId);
    await findDogWithAccess(this.dogRepo, item.dogId, user, { requireOwner: true });
    Object.assign(item, dto);
    return this.wardrobeRepo.save(item);
  }

  async remove(itemId: string, user: JwtPayload) {
    this.assertOwner(user);
    const item = await this.findItem(itemId);
    await findDogWithAccess(this.dogRepo, item.dogId, user, { requireOwner: true });
    await this.wardrobeRepo.remove(item);
    return { message: 'Artículo eliminado' };
  }

  private async findItem(id: string) {
    const item = await this.wardrobeRepo.findOne({ where: { id } });
    if (!item) {
      throw new NotFoundException('Artículo no encontrado');
    }
    return item;
  }
}
