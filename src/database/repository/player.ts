import { EntityRepository, Repository, getCustomRepository } from "typeorm";
import { Game } from "../entity/Game";

import { Player } from '../entity/Player';

@EntityRepository(Player)
export class PlayerRepository extends Repository<Player> {
    make(player: Player): Promise<Player> {
        const playerEntity = Object.assign(new Player(), player);

        return this.save(playerEntity);
    }

    getPlayersByGame(game: Game): Promise<Player[]> {
        return this.find({ where: { game_id: game.id } });
    }
}

export const DefaultGameRepository = () => new PlayerRepository();