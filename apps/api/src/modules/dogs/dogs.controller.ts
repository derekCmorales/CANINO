import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRole } from '../../common/enums';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser, JwtPayload } from '../../common/decorators/current-user.decorator';
import { successResponse } from '../../common/dto/api-response.dto';
import { DogsService } from './dogs.service';
import { CreateDogDto, UpdateDogDto, UpdateDogPhotoDto } from './dto/dog.dto';
import {
  UpsertBaptismDto,
  UpsertMemorialDto,
  UpsertOriginDto,
  UpsertPreferencesDto,
} from './dto/dog-related.dto';

@ApiTags('Perros')
@ApiBearerAuth()
@Controller('dogs')
export class DogsController {
  constructor(private readonly dogsService: DogsService) {}

  @Post()
  @Roles(UserRole.OWNER)
  @ApiOperation({ summary: 'Registrar un nuevo perro' })
  async create(@CurrentUser() user: JwtPayload, @Body() dto: CreateDogDto) {
    const dog = await this.dogsService.create(user, dto);
    return successResponse(dog);
  }

  @Get()
  @ApiOperation({ summary: 'Listar perros según rol del usuario' })
  async findAll(@CurrentUser() user: JwtPayload) {
    const dogs = await this.dogsService.findAll(user);
    return successResponse(dogs);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener detalle de un perro' })
  async findOne(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    const dog = await this.dogsService.findOne(id, user);
    return successResponse(dog);
  }

  @Patch(':id')
  @Roles(UserRole.OWNER)
  @ApiOperation({ summary: 'Actualizar datos de un perro' })
  async update(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdateDogDto,
  ) {
    const dog = await this.dogsService.update(id, user, dto);
    return successResponse(dog);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un perro' })
  async remove(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    const result = await this.dogsService.remove(id, user);
    return successResponse(result);
  }

  @Get(':id/timeline')
  @ApiOperation({ summary: 'Obtener línea de tiempo unificada del perro' })
  async timeline(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    const events = await this.dogsService.getTimeline(id, user);
    return successResponse(events);
  }

  @Post(':id/photos')
  @Roles(UserRole.OWNER)
  @ApiOperation({ summary: 'Actualizar foto principal del perro' })
  async updatePhoto(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdateDogPhotoDto,
  ) {
    const dog = await this.dogsService.updatePhoto(id, user, dto);
    return successResponse(dog);
  }

  @Put(':id/origin')
  @Roles(UserRole.OWNER)
  @ApiOperation({ summary: 'Registrar o actualizar origen del perro' })
  async upsertOrigin(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpsertOriginDto,
  ) {
    const origin = await this.dogsService.upsertOrigin(id, user, dto);
    return successResponse(origin);
  }

  @Put(':id/baptism')
  @Roles(UserRole.OWNER)
  @ApiOperation({ summary: 'Registrar o actualizar bautizo del perro' })
  async upsertBaptism(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpsertBaptismDto,
  ) {
    const baptism = await this.dogsService.upsertBaptism(id, user, dto);
    return successResponse(baptism);
  }

  @Put(':id/preferences')
  @Roles(UserRole.OWNER)
  @ApiOperation({ summary: 'Registrar o actualizar preferencias del perro' })
  async upsertPreferences(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpsertPreferencesDto,
  ) {
    const preferences = await this.dogsService.upsertPreferences(id, user, dto);
    return successResponse(preferences);
  }

  @Put(':id/memorial')
  @Roles(UserRole.OWNER)
  @ApiOperation({ summary: 'Registrar memorial y marcar fallecimiento' })
  async upsertMemorial(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpsertMemorialDto,
  ) {
    const memorial = await this.dogsService.upsertMemorial(id, user, dto);
    return successResponse(memorial);
  }

  @Get(':id/memorial')
  @ApiOperation({ summary: 'Consultar memorial del perro' })
  async getMemorial(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    const memorial = await this.dogsService.getMemorial(id, user);
    return successResponse(memorial);
  }
}
