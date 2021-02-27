import { User as UserEntity } from '../database/entity/User';
import { UserRepository } from '../database/repository/user';
import { handleRegisterError } from './response';
import { Res, Response, ErrorResponse } from '../response';
import { Auth } from '../auth';

interface UserRequest extends UserEntity {
    token: string;
}

export class User {
    constructor(
        private res: Res,
        private params: UserRequest,
        private userRepository: UserRepository,
        private auth?: Auth
    ) {
        if (!auth) {
            this.auth = new Auth();
        }
    }

    async getById(): Promise<Response> {
        try {
            const result = await this.userRepository.getUserById(this.params.id);

            if (result.length === 0) {
                return new ErrorResponse(this.res, 400)
            }
            await result[0].games;
            return new Response(this.res, 200, '', {
                user: {
                    ...result[0]
                }
            });
        } catch (err) {
            return new ErrorResponse(this.res);
        }
    }

    private async verifyPassword(): Promise<Response> {
        try {
            const result = await this.userRepository.verifyPassword(this.params);

            if (!result) {
                throw new ErrorResponse(this.res, 403, 'Username or password is incorrect');
            }
        } catch (err) {
            return new ErrorResponse(this.res, null, err);
        }
    }

    private async createToken(): Promise<Response> {
        try {
            const user = await this.userRepository.getUser(this.params);
            const authResult = await this.auth.sign(user.id)
            return new Response(this.res, 200, authResult.toString());
        } catch (err) {
            return new ErrorResponse(this.res)
        }
    }

    async login(): Promise<Response> {
        try {
            await this.verifyPassword();
            return await this.createToken();
        } catch (err) {
            return err
        }

    }

    async register(): Promise<Response> {
        try {
            const result = await this.userRepository.saveUser(this.params);

            return new Response(this.res, 200, '', {
                user: {
                    ...result
                }
            });
        } catch (err) {
            return handleRegisterError(this.res, err.errno);
        }
    }
}

export const userGate = (req, res): Boolean => {
    const id = res.locals?.id;

    if (!id) {
        return false;
    }

    if (req.query.id?.toString() === id.toString() || req.body.id?.toString() === id.toString()) {
        return true;
    }
    return false
}