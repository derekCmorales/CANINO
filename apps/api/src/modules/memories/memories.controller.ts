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
import { UserRole } from '../../common/enums';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser, JwtPayload } from '../../common/decorators/current-user.decorator';
import { successResponse } from '../../common/dto/api-response.dto';
import { MemoriesService } from './memories.service';
import { CreateMemoryDto, UpdateMemoryDto } from './dto/memory.dto';

@ApiTags('Memorias')
@ApiBearerAuth()
@Roles(UserRole.OWNER)
@Controller('dogs/:dogId/memories')
export class MemoriesController {
  constructor(private readonly memoriesService: MemoriesService) {}

  @Get()
  @ApiOperation({ summary: 'Listar momentos memorables' })
  async findAll(@Param('dogId') dogId: string, @CurrentUser() user: JwtPayload) {
    const memories = await this.memoriesService.findAll(dogId, user);
    return successResponse(memories);
  }

  @Post()
  @ApiOperation({ summary: 'Crear momento memorable' })
  async create(
    @Param('dogId') dogId: string,
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateMemoryDto,
  ) {
    const memory = await this.memoriesService.create(dogId, user, dto);
    return successResponse(memory);
  }

  @Patch(':memoryId')
  @ApiOperation({ summary: 'Actualizar momento memorable' })
  async update(
    @Param('memoryId') memoryId: string,
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdateMemoryDto,
  ) {
    const memory = await this.memoriesService.update(memoryId, user, dto);
    return successResponse(memory);
  }

  @Delete(':memoryId')
  @ApiOperation({ summary: 'Eliminar momento memorable' })
  async remove(@Param('memoryId') memoryId: string, @CurrentUser() user: JwtPayload) {
    const result = await this.memoriesService.remove(memoryId, user);
    return successResponse(result);
  }
}
