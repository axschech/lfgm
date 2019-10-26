import express from 'express';

import { DefaultUserFactory } from './database/repositories/user';
import conn from './database/connection';

class Response {
    constructor(message, error) {
        this.message = message;
        this.error = error;

        return this;
    }
}

const app = express(),
    port = process.env.PORT || 9001,
    userRepository = DefaultUserFactory(),
    defaultErrorResponse = new Response('', 'BadRequest');

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/register', (req, res) => {
    let errResponse;

    userRepository.register(req.query)
        .then(() => res.send('You did it!'))
        .catch((errs) => {
            res.statusCode = 400;
            if (errs.errors.filter(err => {
                return err.validatorKey === 'isEmail'
            }).length> 0) {
                errResponse = new Response(
                    "",
                    "InvalidEmail"
                )
            }
            res.send(errResponse || defaultErrorResponse)
        })
})

app.get('/login', (req, res) => {
    console.log(req.query);
    userRepository.login(req.query).then(() => {
        res.send('logged in');
    }).catch(() => {
        res.send('incorrect username or password');
    })
})

conn.sync().then(() => {
    app.listen(9001, () => {
        console.log(`app listening on port ${port}!`)
    })
}).catch((err) => {
    console.log(err)
});