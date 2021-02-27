import * as bcrypt from 'bcrypt';

import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate, AfterLoad, AfterInsert, AfterUpdate, ManyToOne, OneToMany, JoinColumn } from "typeorm";

import { Game } from './Game';

export abstract class PartialUser {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column({
        unique: true
    })
    email: string;

    @OneToMany(type => Game, game => game.creator, {
        eager: true
    })
    @JoinColumn()
    games: Game[]
}

@Entity()
export class User extends PartialUser {
    @Column({
        select: false
    })
    password: string;

    @BeforeInsert()
    @BeforeUpdate()
    hashPassword() {
        this.password = bcrypt.hashSync(this.password, 10);
    }

    @AfterInsert()
    @AfterUpdate()
    stripPassword() {
        this.password = '';
    }
}