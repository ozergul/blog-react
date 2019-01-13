import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    BaseEntity,
} from 'typeorm'



@Entity()
export class PostMeta extends BaseEntity {
    @PrimaryGeneratedColumn() id: number

    @Column() postId: string
    @Column({ type: "longtext" }) metaKey: string
    @Column() metaValue: number
}