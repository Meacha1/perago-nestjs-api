import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { EntityManager } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';
import { Position } from './entities/position.entity';
import { promises } from 'dns';
import { UUID } from 'crypto';

@Injectable()
export class PositionsService {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager
    ) {}
  
  async create(createPositionDto: CreatePositionDto): Promise<Position> {
    const newPosition = new Position();
    newPosition.name = createPositionDto.name;
    newPosition.description = createPositionDto.description;
    newPosition.parentId = createPositionDto.parentId;
    this.entityManager.save(newPosition);

    return newPosition;
  }

  async findAll(): Promise<Position[]> {
    const result =  await this.entityManager.find(Position)
    return result;
  }

  async findOne(id: UUID): Promise<Position> {
    const result = await this.entityManager.findOne(Position, {where: {id: id}});
    return result;
  }

  async findMyChildrens(id: UUID): Promise<Position[]> {
    const result = await this.entityManager.find(Position, {where: {parentId: id}})
    return result;
  }


  async update(id: UUID, updatePositionDto: UpdatePositionDto): Promise<Position> {
    let updatedPosition  = await this.findOne(id);

    if(!updatedPosition){
      throw new NotFoundException('Position not found');
    }

    updatedPosition  = { ...updatedPosition, ...updatePositionDto };

    return this.entityManager.save(Position, updatedPosition );
  }

  remove(id: UUID) {
    return `This action removes a #${id} position`;
  }
}
