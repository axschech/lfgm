import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";

import { User } from './User';

@Entity()
export class Player {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    user_id: number;

    @Column()
    game_id: number
}