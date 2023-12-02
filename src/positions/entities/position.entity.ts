import { UUID } from 'crypto';
import {Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn} from 'typeorm'

@Entity('position')
export class Position {
    @PrimaryGeneratedColumn('uuid')
    id: UUID;

    @Column()
    name:string;

    @Column()
    description: string;

    @ManyToOne(() => Position, {nullable:true})
    @JoinColumn()
    parent: Position;

    @Column({ nullable: true, type: 'uuid' })
    parentId: string;
}
