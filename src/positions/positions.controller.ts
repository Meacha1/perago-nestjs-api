import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe } from '@nestjs/common';
import { PositionsService } from './positions.service';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { UUID } from 'crypto';

@Controller('positions')
export class PositionsController {
  constructor(private readonly positionsService: PositionsService) {}

  @Post()
  create(@Body(ValidationPipe) createPositionDto: CreatePositionDto) {
    return this.positionsService.create(createPositionDto);
  }

  @Get()
  findAll() {
    return this.positionsService.findAll();
  }

  @Get('childrens/:id')
  findMyChildrens(@Param('id') id: UUID) {
    return this.positionsService.findMyChildrens(id);
  }

  @Get(':id')
  findOne(@Param('id') id: UUID) {
    return this.positionsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: UUID, @Body(ValidationPipe) updatePositionDto: UpdatePositionDto) {
    return this.positionsService.update(id, updatePositionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: UUID) {
    return this.positionsService.remove(id);
  }
}
