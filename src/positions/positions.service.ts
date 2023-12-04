import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Position } from './entities/position.entity';
import { UUID } from 'crypto';

@Injectable()
export class PositionsService {
  constructor(
    @InjectRepository(Position)
    private readonly positionRepository: Repository<Position>,
  ) {}

  async create(createPositionDto: CreatePositionDto): Promise<void> {
    await this.positionRepository.insert(createPositionDto);
  }

  async findAll(): Promise<Position[]> {
    return this.positionRepository.find();
  }

  async findOne(id: UUID): Promise<Position> {
    return this.positionRepository.findOne({where: {id: id}});
  }

  async findMyChildrens(id: UUID): Promise<Position[]> {
    const allChildrens: Position[] = [];
  
    const findChildrenRecursive = async (parentId: UUID) => {
      const result = await this.positionRepository.find({ where: { parentId } });
  
      if (result.length > 0) {
        allChildrens.push(...result);
  
        for (const child of result) {
          await findChildrenRecursive(child.id);
        }
      }
    };
  
    await findChildrenRecursive(id);
  
    return allChildrens;
  }

  async update(id: UUID, updatePositionDto: UpdatePositionDto): Promise<Position> {
    let updatedPosition = await this.findOne(id);

    if (!updatedPosition) {
      throw new NotFoundException('Position not found');
    }

    updatedPosition = { ...updatedPosition, ...updatePositionDto };

    return this.positionRepository.save(updatedPosition);
  }

  async remove(id: UUID): Promise<void> {
    const deletedPosition = await this.positionRepository.delete(id);
    if (deletedPosition.affected === 0) {
      throw new NotFoundException('Position not found');
    }
  }
}
