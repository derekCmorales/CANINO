import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Breed } from './entities/breed.entity';
import { VaccineType } from './entities/vaccine-type.entity';
import { CatalogsController } from './catalogs.controller';
import { AdminCatalogsController } from './admin-catalogs.controller';
import { CatalogsService } from './catalogs.service';

@Module({
  imports: [TypeOrmModule.forFeature([Breed, VaccineType])],
  controllers: [CatalogsController, AdminCatalogsController],
  providers: [CatalogsService],
  exports: [CatalogsService, TypeOrmModule],
})
export class CatalogsModule {}
