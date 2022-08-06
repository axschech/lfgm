import { User, UserModel } from '../model/user';
import { ErrorResponse, Res, Response, StatusCodes, E } from '../response';
import { Repository } from './repository';

export class UserRepository implements Repository<User> {
    model: UserModel;
    res: Res;
    constructor(user: UserModel, res: Res) {
        this.model = user;
        this.res = res;
    }

    private returnResponse(userResult?: User) {
        if (!userResult) {
            return new ErrorResponse(this.res, StatusCodes.NOT_FOUND);
        }
        return new Response(this.res, StatusCodes.SUCCESS, '', userResult);
    }

    async getUser(config: number | object): Promise<Response> {
        switch (typeof config) {
            case "number":
                const userResultById = await this.model.getById(config);
                return this.returnResponse(userResultById);
            case "object":
                const userResult = await this.model.get(config);
                return this.returnResponse(userResult);
            default:
                console.error('userrepository: getuser: wrong data provided');
                process.exit(1);
                break;
        }
    }

    async registerUser(user: User): Promise<Response> {
        const result = await this.model.insert(user);

        if ("error" in result) {
            return new ErrorResponse(this.res, 400, "Bad Request")
        }
        return this.returnResponse(result)
    }
}


export const DefaultUserRepository = (res: Res) => {
    return new UserRepository(new UserModel(), res);
}