import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    BaseEntity,
    CreateDateColumn
} from 'typeorm';

@Entity()
export class Attachment extends BaseEntity {
    @PrimaryGeneratedColumn() id: number
    @CreateDateColumn() createdAt: string;
    @Column() location: string
    @Column() key: string
    @Column() type: string
}
