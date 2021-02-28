import * as bcrypt from 'bcrypt';

import { EntityRepository, Repository, getCustomRepository } from "typeorm";
import { User, PartialUser } from '../entity/User';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
    getUserById(id: number, full?: boolean) {
        const options: { relations?: string[] } = {};

        if (full) {
            options.relations = ['created_games']
        }
        return this.findByIds([id], { ...options });
    }

    getUser(user: PartialUser) {
        return this.findOne({ email: user.email });
    }

    saveUser(user: PartialUser) {
        const entity = Object.assign(new User(), user);

        return this.save(entity);
    }

    async verifyPassword(user: User): Promise<PartialUser | false> {
        const result = await this.find({ select: ['password'], where: { email: user.email } });

        if (result.length === 0) {
            return false;
        }

        const bcrpytResult = await bcrypt.compare(user.password, result[0].password);

        return bcrpytResult ? {
            id: user.id,
            email: user.email,
            username: user.username,
            created_games: user.created_games
        } : false;
    }
}

export const DefaultUserRepository = () => getCustomRepository(UserRepository);