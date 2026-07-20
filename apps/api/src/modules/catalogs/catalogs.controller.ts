import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/roles.decorator';
import { successResponse } from '../../common/dto/api-response.dto';
import { CatalogsService } from './catalogs.service';

@ApiTags('Catálogos')
@Controller('catalogs')
export class CatalogsController {
  constructor(private readonly catalogsService: CatalogsService) {}

  @Public()
  @Get('breeds')
  @ApiOperation({ summary: 'Listar razas activas' })
  async breeds() {
    const breeds = await this.catalogsService.findBreeds();
    return successResponse(breeds);
  }

  @Public()
  @Get('vaccine-types')
  @ApiOperation({ summary: 'Listar tipos de vacuna activos' })
  async vaccineTypes() {
    const types = await this.catalogsService.findVaccineTypes();
    return successResponse(types);
  }
}
