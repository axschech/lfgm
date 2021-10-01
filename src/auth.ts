import *  as jwt from 'jsonwebtoken';
import { fromUnixTime, sub, isAfter } from 'date-fns';

const DEFAULT_EXPIRE_TIME = 60 * 30;

export class Auth {
    private secret: string;

    constructor() {
        this.secret = process.env.HMAC_SECRET;
        if (!this.secret) {
            console.log('\nmissing secret');
            process.exit(1);
        }
    }

    async sign(id: number) {
        return await jwt.sign({ id }, this.secret, {
            expiresIn: DEFAULT_EXPIRE_TIME
        });
    }

    async verify(token: string): Promise<{
        payload: {
            exp: number,
            id: number
        }
    }> {
        return await jwt.verify(token, this.secret, {
            complete: true
        });
    }
}

export const authGate = async (req, res): Promise<Boolean> => {
    const auth = new Auth();
    const token = req.headers.authorization?.split('Bearer ').pop();

    if (!token) {
        return false;
    }

    try {
        const result = await auth.verify(token);

        res.locals.id = result.payload.id;

        const expiresAt = fromUnixTime(result.payload.exp)
        const targetAt = sub(expiresAt, {
            minutes: 5
        });

        res.locals.token = isAfter(new Date(), targetAt) && await auth.sign(req.query.id);
        return true;
    } catch (err) {
        return false;
    }
};