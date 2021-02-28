import { EntityRepository, Repository, getCustomRepository, getRepository } from "typeorm";

import { User } from '../entity/User';

import { Game } from '../entity/Game';
import { DefaultUserRepository, UserRepository } from "./user";

@EntityRepository(Game)
export class GameRepository extends Repository<Game> {
    getGameById(id: number) {
        return this.findByIds([id]);
    }

    async saveGame(game: Game): Promise<Game> {
        const gameEntity = Object.assign(new Game(), game);

        return this.save(gameEntity);
    }

    async getGamesByUser(user: User): Promise<Game[]> {
        return this.find({ where: { creator: user } });
    }
}

export const DefaultGameRepository = () => getCustomRepository(GameRepository);