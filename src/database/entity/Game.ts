import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate, AfterLoad, AfterInsert, AfterUpdate, OneToOne, JoinColumn, ManyToOne } from "typeorm";

import { User } from './User';

@Entity()
export class Game {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @ManyToOne(type => User, user => user.games)
    creator: User;
}