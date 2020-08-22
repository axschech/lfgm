import { User as UserEntity, PartialUser } from '../database/entity/User';
import { DefaultUserRepository } from '../database/repository/user';
import { handleRegisterError } from './response';
import { Res, Response, ErrorResponse } from '../response';
import { Auth } from '../auth';

interface UserRequest extends UserEntity {
    token: string;
}

export class User {
    constructor(private res: Res, private params: UserRequest) { }

    async getById() {
        try {
            const result = await DefaultUserRepository().getUserById(this.params.id);
            if (result.length === 0) {
                new ErrorResponse(this.res, 400).send()
                return;
            }
            new Response(this.res, 200, '', {
                user: {
                    ...result[0]
                }
            }).send();
        } catch (err) {
            new ErrorResponse(this.res).send();
        }
    }

    private async verifyPassword(): Promise<boolean> {
        try {
            const result = await DefaultUserRepository().verifyPassword(this.params);

            if (!result) {
                new ErrorResponse(this.res, 403, 'Username or password is incorrect').send();
                return false;
            }
        } catch (err) {
            new ErrorResponse(this.res).send();
            return false;
        }
        return true;
    }

    private async createToken(): Promise<boolean> {
        const auth = new Auth();

        try {
            const user = await DefaultUserRepository().getUser(this.params);
            const authResult = await auth.sign(user.id)
            new Response(this.res, 200, authResult.toString()).send();
            return true;
        } catch (err) {
            new ErrorResponse(this.res).send();
            return false;
        }
    }

    async login() {
        return await this.verifyPassword() && await this.createToken();
    }

    async register() {
        try {
            const result = await DefaultUserRepository().saveUser(this.params);

            new Response(this.res, 200, '', {
                user: {
                    ...result
                }
            }).send();
        } catch (err) {
            handleRegisterError(this.res, err.errno)
        }
    }
}

export const userGate = (req, res) => {
    const id = res.locals?.id;
    if (!id) {
        new ErrorResponse(res, 400).send();
        return false;
    }

    if (req.query.id.toString() === id.toString() || req.body.id.toString() === id.toString()) {
        return true;
    }
    new ErrorResponse(res, 400).send()
    return false;
}