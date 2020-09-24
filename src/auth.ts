import *  as jwt from 'jsonwebtoken';
import * as moment from 'moment';

import { ErrorResponse } from './response'

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

export const authGate = async (req, res) => {
    const auth = new Auth();
    const token = req.headers.authorization?.split('Bearer ').pop();
    if (!token) {
        new ErrorResponse(res, 403).send();
        return false;
    }

    try {
        const result = await auth.verify(token);

        res.locals.id = result.payload.id;

        const expiresAt = moment.unix(result.payload.exp)
        const targetAt = expiresAt.subtract(5, 'minutes');

        res.locals.token = moment().isAfter(targetAt) && await auth.sign(req.query.id)
    } catch (err) {
        new ErrorResponse(res, 403).send();
        return false;
    }
    return true;
}