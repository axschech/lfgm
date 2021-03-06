import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";

import { User } from './User';

@Entity()
export class Game {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @ManyToOne(type => User)
    creator: User;
}