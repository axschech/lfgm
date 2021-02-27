import { Game as GameRequest } from '../database/entity/Game';
import { DefaultGameRepository, GameRepository } from '../database/repository/game';
import { UserRepository } from '../database/repository/user';

import { Res, Response, ErrorResponse } from '../response';

export class Game {
    constructor(
        private res: Res,
        private params: GameRequest,
        private gameRepository: GameRepository,
        private userRepository?: UserRepository
    ) { }

    async createGame(): Promise<Response> {
        if (!this.userRepository) {
            return new ErrorResponse(this.res, 500);
        }

        const game = await this.gameRepository.saveGame(this.params);
        if (!game) {
            return new ErrorResponse(this.res);
        }

        const getUserResult = await this.userRepository.getUserById(this.params.creator.id);
        if (!getUserResult.length) {
            return new ErrorResponse(this.res);
        }
        const user = getUserResult[0];

        user.games = [game];

        await this.userRepository.saveUser(user);

        return new Response(this.res, 200, '', game);
    }
}