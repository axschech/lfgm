import { User } from "./user";

export interface Game {
    id: number;
    name: string;
    description: string;
    Users: User[];
}