import { Game as GameRequest } from '../database/entity/Game';
import { User } from '../database/entity/User';
import { GameRepository } from '../database/repository/game';

import { Res, Response, ErrorResponse } from '../response';

export class Game {
    constructor(
        private res: Res,
        private params: GameRequest,
        private gameRepository: GameRepository
    ) { }

    async createGame(): Promise<Response> {
        const game = await this.gameRepository.create(this.params);
        if (!game) {
            return new ErrorResponse(this.res);
        }

        return new Response(this.res, 200, '', game);
    }

    async getGamesByUser(): Promise<Response> {
        const user = Object.assign(new User(), { id: this.params.id })
        const result = await this.gameRepository.getGamesByUser(user);

        if (!result.length) {
            return new ErrorResponse(this.res, 404);
        }

        return new Response(this.res, 200, '', result);
    }
}