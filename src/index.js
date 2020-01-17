import {} from 'dotenv/config';

import express from 'express';
import path from 'path';

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

app.use(express.json());
app.use('/static', express.static('/public'))
app.get('/', (req, res) => {
    res.sendFile(path.resolve('../static/index.html'));
});

app.get('/status', (req, res) => {
    res.send('OK')
})

app.post('/register', (req, res) => {
    let errResponse;
    
    userRepository.register(req.body)
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

app.post('/login', (req, res) => {
    userRepository.login(req.query).then(() => {
        res.send('logged in');
    }).catch(() => {
        res.send('incorrect username or password');
    })
})

app.listen(port, () => {
    console.log('listening on ' + port)
    start_db();
})

function start_db() {
    return conn.sync().then(() => {
        console.log('made it')
    }).catch(() => {
        console.log('retrying')
        setTimeout(start_db, 10000);
    })
}