import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    BaseEntity,
} from 'typeorm'

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn() id: number
    @Column() email: string
    @Column() username: string
    @Column() password: string
}
