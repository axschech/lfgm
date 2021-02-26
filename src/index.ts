import './bootstrap';
import 'reflect-metadata';

import * as moment from 'moment';
import * as express from 'express';
import * as bodyParser from 'body-parser';

import { connection } from './database/connection';

import { User, userGate } from './user';
import { authGate } from './auth';
import { ErrorResponse } from './response';

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
    const resp = await new User(res, req.body).login();

    return resp.send()
});

app.get('/user', combinedGates, async (req, res) =>
    (await new User(res, req.query).getById()).send());

app.post('/user', async (req, res) =>
    (await new User(res, req.body).register()).send());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    connect();
    console.log(`Server is running in http://localhost:${PORT}`)
});

process.on('SIGTERM', function () {
    console.log('\ncaught SIGTERM, stopping gracefully');
    process.exit(1);
});