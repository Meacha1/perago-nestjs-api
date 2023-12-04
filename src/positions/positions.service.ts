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
    const name = createPositionDto.name;
    const isExist = await this.positionRepository.findOne({where: {name: name}});
    if (isExist) {
      throw new NotFoundException('Position already exist');
    }
    await this.positionRepository.insert(createPositionDto);
  }

  async findAll(): Promise<Position[]> {
    const allPositions: Position[] = [];
    const root = await this.positionRepository.findOne({where: {parentId: null}});
    allPositions.unshift(root);
    await this.findChildrenRecursive(root.id, allPositions);
    return allPositions;
  }

  async findOne(id: UUID): Promise<Position> {
    return await this.positionRepository.findOne({where: {id: id}});
  }

  async findMyChildrens(id: UUID): Promise<Position[]> {
    const allChildrens: Position[] = [];
    await this.findChildrenRecursive(id, allChildrens);
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
    const isParent = await this.positionRepository.findOne({where: {parentId: id}});
    if (isParent) {
      throw new NotFoundException('Position is parent');
    }
    const deletedPosition = await this.positionRepository.delete(id);
    if (deletedPosition.affected === 0) {
      throw new NotFoundException('Position not found');
    }
  }

  private async findChildrenRecursive(parentId: UUID, allChildrens: Position[]): Promise<void> {
    const result = await this.positionRepository.find({ where: { parentId } });

    if (result.length > 0) {
      allChildrens.push(...result);

      for (const child of result) {
        await this.findChildrenRecursive(child.id, allChildrens);
      }
    }
  }
}
