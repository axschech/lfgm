import './bootstrap';
import 'reflect-metadata';

import * as moment from 'moment';
import * as express from 'express';
import * as bodyParser from 'body-parser';

import { connection } from './database/connection';

import { User, userGate } from './user';
import { authGate } from './auth';

import { Game } from './game';

import { ErrorResponse } from './response';
import { DefaultGameRepository } from './database/repository/game';
import { DefaultUserRepository } from './database/repository/user';

const app = express();

app.use(bodyParser.json());


const combinedGates = async (req, res, next) => {
    const authed = await authGate(req, res),
        err = new ErrorResponse(res, 403);

    if (!authed) {
        err.send();
        return;
    }

    const isUser = await userGate(req, res);

    if (!isUser) {
        err.send();
        return;
    }
    next();
}

const connect = () => {
    connection.then(() => console.log('connected')).catch(() => {
        console.warn("didn't connect");
        setTimeout(connect, 3000)
    });
}

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.post('/login', async (req, res) => {
    const resp = await new User(
        res,
        req.body,
        DefaultUserRepository()
    ).login();

    return resp.send()
});

app.get('/user/:id', combinedGates, async (req, res) =>
    (await new User(
        res,
        req.params,
        DefaultUserRepository()
    ).getById()).send());

app.get('/user/:id/games', combinedGates, async (req, res) =>
    (await new Game(
        res,
        req.params,
        DefaultGameRepository()
    ).getGameByUser()).send())

app.post('/user', async (req, res) =>
    (await new User(
        res,
        req.body,
        DefaultUserRepository()
    ).register()).send());


app.post('/game', combinedGates, async (req, res) => {
    const result = await new Game(
        res,
        req.body,
        DefaultGameRepository()
    ).createGame();

    result.send();
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    connect();
    console.log(`Server is running in http://localhost:${PORT}`)
});

process.on('SIGTERM', function () {
    console.log('\ncaught SIGTERM, stopping gracefully');
    process.exit(1);
});