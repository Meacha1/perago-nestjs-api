import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { EntityManager } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';
import { Position } from './entities/position.entity';
import { UUID } from 'crypto';

@Injectable()
export class PositionsService {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager
    ) {}
  
    async create(createPositionDto: CreatePositionDto): Promise<Position> {
      let newPosition = new Position();
      newPosition = { ...newPosition, ...createPositionDto }
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

  async remove(id: UUID): Promise<void> {
    const deletedPosition = await  this.entityManager.delete(Position, {id: id});
    if(!deletedPosition){
      throw new NotFoundException('Position not found');
    } else {
      console.log('Position deleted')
    }
  }
}
