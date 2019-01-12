import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    BaseEntity,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToMany,
    JoinTable,
    BeforeInsert,
    BeforeUpdate
} from 'typeorm'

import {Term} from "./term"

import * as helpers from "../utils/helpers";

@Entity()
export class Post extends BaseEntity {
    @PrimaryGeneratedColumn() id: number

    @Column() title: string
    @Column() slug: string
    @Column() content: string
    @Column() userId: number
    @Column() postType: number
    @Column() status: number

    @CreateDateColumn() createdAt: string;
    @UpdateDateColumn({ type: "timestamp" }) updatedAt: number;

    @ManyToMany(type => Term, term => term.posts)
    @JoinTable()
    terms: Term[];

    @BeforeInsert()
    async createSlug() {
        let slug = helpers.toSeoUrl(this.title);
        this.slug = `${slug}`
    }
}