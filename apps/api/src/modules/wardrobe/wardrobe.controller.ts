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
import { WardrobeService } from './wardrobe.service';
import { CreateWardrobeItemDto, UpdateWardrobeItemDto } from './dto/wardrobe.dto';

@ApiTags('Ropa y accesorios')
@ApiBearerAuth()
@Roles(UserRole.OWNER)
@Controller('dogs/:dogId/wardrobe')
export class WardrobeController {
  constructor(private readonly wardrobeService: WardrobeService) {}

  @Get()
  @ApiOperation({ summary: 'Listar inventario de ropa y accesorios' })
  async findAll(@Param('dogId') dogId: string, @CurrentUser() user: JwtPayload) {
    const items = await this.wardrobeService.findAll(dogId, user);
    return successResponse(items);
  }

  @Post()
  @ApiOperation({ summary: 'Agregar artículo al inventario' })
  async create(
    @Param('dogId') dogId: string,
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateWardrobeItemDto,
  ) {
    const item = await this.wardrobeService.create(dogId, user, dto);
    return successResponse(item);
  }

  @Patch(':itemId')
  @ApiOperation({ summary: 'Actualizar artículo' })
  async update(
    @Param('itemId') itemId: string,
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdateWardrobeItemDto,
  ) {
    const item = await this.wardrobeService.update(itemId, user, dto);
    return successResponse(item);
  }

  @Delete(':itemId')
  @ApiOperation({ summary: 'Eliminar artículo' })
  async remove(@Param('itemId') itemId: string, @CurrentUser() user: JwtPayload) {
    const result = await this.wardrobeService.remove(itemId, user);
    return successResponse(result);
  }
}
