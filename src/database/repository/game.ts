import { EntityRepository, Repository, getCustomRepository } from "typeorm";

import { User } from '../entity/User';

import { Game } from '../entity/Game';

@EntityRepository(Game)
export class GameRepository extends Repository<Game> {
    getById(id: number[]) {
        return this.findByIds(id);
    }

    async upsert(game: Game): Promise<Game> {
        const gameEntity = Object.assign(new Game(), game);

        return this.save(gameEntity);
    }

    async getGamesByUser(user: User): Promise<Game[]> {
        return this.find({ where: { creator: user } });
    }
}

export const DefaultGameRepository = () => getCustomRepository(GameRepository);