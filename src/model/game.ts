import { KnexWrapper, Model } from "./model";
import { User } from "./user";

export interface Game {
    id: number;
    name: string;
    description: string;
    Users: User[];
}

// export class GameModel implements Model<Game> {
//     knexWrapper: KnexWrapper<Game>;


// }