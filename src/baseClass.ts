import { Entity, Repository } from 'typeorm';
import { Game } from './database/entity/Game';
import { Player } from './database/entity/Player';
import { User } from './database/entity/User';
import { GameRepository } from './database/repository/game';
import { PlayerRepository } from './database/repository/player';
import { UserRepository } from './database/repository/user';

import { Response, Res } from './response';

type repos = GameRepository | PlayerRepository | UserRepository
type params = Game | Player | User;

interface BaseProps {
    res: Res,
    params: params
    repo: repos
}
export abstract class BaseClass<T extends params, R extends repos> {
    constructor(public res: Res, public params: T, public repo: R) { }
}

export abstract class BaseRepository {

}