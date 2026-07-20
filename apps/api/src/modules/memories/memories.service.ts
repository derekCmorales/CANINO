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
import { Memory } from './entities/memory.entity';
import { CreateMemoryDto, UpdateMemoryDto } from './dto/memory.dto';

@Injectable()
export class MemoriesService {
  constructor(
    @InjectRepository(Memory) private readonly memoryRepo: Repository<Memory>,
    @InjectRepository(Dog) private readonly dogRepo: Repository<Dog>,
  ) {}

  private assertOwner(user: JwtPayload) {
    if (user.role !== UserRole.OWNER) {
      throw new ForbiddenException('Solo el dueño puede gestionar memorias');
    }
  }

  async findAll(dogId: string, user: JwtPayload) {
    this.assertOwner(user);
    await findDogWithAccess(this.dogRepo, dogId, user, { requireOwner: true });
    return this.memoryRepo.find({ where: { dogId }, order: { createdAt: 'DESC' } });
  }

  async create(dogId: string, user: JwtPayload, dto: CreateMemoryDto) {
    this.assertOwner(user);
    await findDogWithAccess(this.dogRepo, dogId, user, { requireOwner: true });
    const memory = this.memoryRepo.create({ dogId, ...dto });
    return this.memoryRepo.save(memory);
  }

  async update(memoryId: string, user: JwtPayload, dto: UpdateMemoryDto) {
    this.assertOwner(user);
    const memory = await this.findMemory(memoryId);
    await findDogWithAccess(this.dogRepo, memory.dogId, user, { requireOwner: true });
    Object.assign(memory, dto);
    return this.memoryRepo.save(memory);
  }

  async remove(memoryId: string, user: JwtPayload) {
    this.assertOwner(user);
    const memory = await this.findMemory(memoryId);
    await findDogWithAccess(this.dogRepo, memory.dogId, user, { requireOwner: true });
    await this.memoryRepo.remove(memory);
    return { message: 'Memoria eliminada' };
  }

  private async findMemory(id: string) {
    const memory = await this.memoryRepo.findOne({ where: { id } });
    if (!memory) {
      throw new NotFoundException('Memoria no encontrada');
    }
    return memory;
  }
}
