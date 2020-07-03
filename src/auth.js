import jwt from 'jsonwebtoken';

const DEFAULT_EXPIRE_TIME = 60 * 60;

export class Auth {
    constructor() {
        this.secret =  process.env.HMAC_SECRET || false;
        if (!this.secret) {
            console.log('\nmissing secret');
            process.exit(1);
        }
    }

    set(id) {
        let promise = new Promise((resolve, reject) => {
            jwt.sign({
                id: id
            }, this.secret, {
                expiresIn: DEFAULT_EXPIRE_TIME
            }, (err, token) => {
                !!err ? reject(err) : resolve(token);
            });
        });

        return promise;
    }

    getSecret() {
        return this.secret;
    }
}