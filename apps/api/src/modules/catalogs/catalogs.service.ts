import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Breed } from './entities/breed.entity';
import { VaccineType } from './entities/vaccine-type.entity';
import {
  CreateBreedDto,
  CreateVaccineTypeDto,
  UpdateBreedDto,
  UpdateVaccineTypeDto,
} from './dto/catalog.dto';

@Injectable()
export class CatalogsService {
  constructor(
    @InjectRepository(Breed) private readonly breedRepo: Repository<Breed>,
    @InjectRepository(VaccineType) private readonly vaccineTypeRepo: Repository<VaccineType>,
  ) {}

  findBreeds(includeInactive = false) {
    return this.breedRepo.find({
      where: includeInactive ? {} : { isActive: true },
      order: { name: 'ASC' },
    });
  }

  async findBreedById(id: string) {
    const breed = await this.breedRepo.findOne({ where: { id } });
    if (!breed) {
      throw new NotFoundException('Raza no encontrada');
    }
    return breed;
  }

  createBreed(dto: CreateBreedDto) {
    const breed = this.breedRepo.create({
      name: dto.name,
      sizeCategory: dto.sizeCategory ?? null,
      isActive: true,
    });
    return this.breedRepo.save(breed);
  }

  async updateBreed(id: string, dto: UpdateBreedDto) {
    const breed = await this.findBreedById(id);
    Object.assign(breed, dto);
    return this.breedRepo.save(breed);
  }

  async deleteBreed(id: string) {
    const breed = await this.findBreedById(id);
    breed.isActive = false;
    return this.breedRepo.save(breed);
  }

  findVaccineTypes(includeInactive = false) {
    return this.vaccineTypeRepo.find({
      where: includeInactive ? {} : { isActive: true },
      order: { name: 'ASC' },
    });
  }

  async findVaccineTypeById(id: string) {
    const vaccineType = await this.vaccineTypeRepo.findOne({ where: { id } });
    if (!vaccineType) {
      throw new NotFoundException('Tipo de vacuna no encontrado');
    }
    return vaccineType;
  }

  createVaccineType(dto: CreateVaccineTypeDto) {
    const vaccineType = this.vaccineTypeRepo.create({
      name: dto.name,
      recommendedIntervalDays: dto.recommendedIntervalDays ?? 365,
      isActive: true,
    });
    return this.vaccineTypeRepo.save(vaccineType);
  }

  async updateVaccineType(id: string, dto: UpdateVaccineTypeDto) {
    const vaccineType = await this.findVaccineTypeById(id);
    Object.assign(vaccineType, dto);
    return this.vaccineTypeRepo.save(vaccineType);
  }

  async deleteVaccineType(id: string) {
    const vaccineType = await this.findVaccineTypeById(id);
    vaccineType.isActive = false;
    return this.vaccineTypeRepo.save(vaccineType);
  }
}
