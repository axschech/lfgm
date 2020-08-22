import * as bcrypt from 'bcrypt';

import { BaseEntity, Entity, Column, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate, AfterLoad, AfterInsert, AfterUpdate } from "typeorm";

export abstract class PartialUser {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column({
        unique: true
    })
    email: string;
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