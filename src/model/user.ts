import { E } from '../response';
import { USERTABLE } from '../schema';
import { Game } from './game';
import { KnexWrapper, Model } from './model';

import * as bcrypt from 'bcrypt';

export interface User {
	id?: number;
	username: string;
	email: string;
	password?: string;
	Games?: Game[];
}

export class UserModel implements Model<User> {
	knexWrapper: KnexWrapper<User>;

	constructor() {
		this.knexWrapper = new KnexWrapper<User>(USERTABLE);
	}
	async getById(id: number): Promise<User> {
		return await this.knexWrapper.select({ id: id })
	}

	async get(where: object): Promise<User> {
		return await this.knexWrapper.select(where)
	}

	async insert(user: User): Promise<User | E> {
		const password = bcrypt.hashSync(user.password, 10);

		return await this.knexWrapper.insert({
			...user,
			password
		} as User, ['*'])
	}
}

export const FilterUser = (user: User): User => ({
	username: user.username,
	email: user.email,
	id: user.id
});
