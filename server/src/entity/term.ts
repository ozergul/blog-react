import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    BaseEntity,
    ManyToMany,
    BeforeInsert,
    RelationCount
} from 'typeorm';

import {Post} from "./post";

import * as helpers from "../utils/helpers";

@Entity()
export class Term extends BaseEntity {
    @PrimaryGeneratedColumn() id: number
    @Column() term: string
    @Column() slug: string
    @Column() description: string
    @Column() type: string

    @ManyToMany(type => Post, post => post.terms)
    posts: Post[];

    @RelationCount((term: Term) => term.posts)
    postsCount: number

    @BeforeInsert()
    async createSlug() {
        let slug = helpers.toSeoUrl(this.term);
        this.slug = `${slug}`
    }
}
