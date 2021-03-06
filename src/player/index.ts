import { BaseClass } from '../baseClass';
import { Game } from '../database/entity/Game';
import { Player as PlayerRequest } from '../database/entity/Player';

import { PlayerRepository } from '../database/repository/player';

import { Res, Response, ErrorResponse } from '../response';

export class Player extends BaseClass<PlayerRequest, PlayerRepository> {
    getPlayersByGame() {
        const gameEntity = Object.assign(new Game(), {
            id: this.params.game_id
        });

        this.repo.getPlayersByGame(gameEntity)
    }
}