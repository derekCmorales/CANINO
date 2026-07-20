import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminSubtype, UserRole } from '../../common/enums';
import { AdminSubtypes, Roles } from '../../common/decorators/roles.decorator';
import { successResponse } from '../../common/dto/api-response.dto';
import { CatalogsService } from './catalogs.service';
import {
  CreateBreedDto,
  CreateVaccineTypeDto,
  UpdateBreedDto,
  UpdateVaccineTypeDto,
} from './dto/catalog.dto';

@ApiTags('Administración de catálogos')
@ApiBearerAuth()
@Roles(UserRole.ADMIN)
@AdminSubtypes(AdminSubtype.SUPER_ADMIN, AdminSubtype.CATALOG_MANAGER)
@Controller('admin')
export class AdminCatalogsController {
  constructor(private readonly catalogsService: CatalogsService) {}

  @Get('breeds')
  @ApiOperation({ summary: 'Listar todas las razas (admin)' })
  async breeds() {
    const breeds = await this.catalogsService.findBreeds(true);
    return successResponse(breeds);
  }

  @Post('breeds')
  @ApiOperation({ summary: 'Crear raza' })
  async createBreed(@Body() dto: CreateBreedDto) {
    const breed = await this.catalogsService.createBreed(dto);
    return successResponse(breed);
  }

  @Patch('breeds/:id')
  @ApiOperation({ summary: 'Actualizar raza' })
  async updateBreed(@Param('id') id: string, @Body() dto: UpdateBreedDto) {
    const breed = await this.catalogsService.updateBreed(id, dto);
    return successResponse(breed);
  }

  @Delete('breeds/:id')
  @ApiOperation({ summary: 'Desactivar raza' })
  async deleteBreed(@Param('id') id: string) {
    const breed = await this.catalogsService.deleteBreed(id);
    return successResponse(breed);
  }

  @Get('vaccine-types')
  @ApiOperation({ summary: 'Listar todos los tipos de vacuna (admin)' })
  async vaccineTypes() {
    const types = await this.catalogsService.findVaccineTypes(true);
    return successResponse(types);
  }

  @Post('vaccine-types')
  @ApiOperation({ summary: 'Crear tipo de vacuna' })
  async createVaccineType(@Body() dto: CreateVaccineTypeDto) {
    const type = await this.catalogsService.createVaccineType(dto);
    return successResponse(type);
  }

  @Patch('vaccine-types/:id')
  @ApiOperation({ summary: 'Actualizar tipo de vacuna' })
  async updateVaccineType(@Param('id') id: string, @Body() dto: UpdateVaccineTypeDto) {
    const type = await this.catalogsService.updateVaccineType(id, dto);
    return successResponse(type);
  }

  @Delete('vaccine-types/:id')
  @ApiOperation({ summary: 'Desactivar tipo de vacuna' })
  async deleteVaccineType(@Param('id') id: string) {
    const type = await this.catalogsService.deleteVaccineType(id);
    return successResponse(type);
  }
}
