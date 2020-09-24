import './bootstrap';
import 'reflect-metadata';

import * as moment from 'moment';
import * as express from 'express';
import * as bodyParser from 'body-parser';

import { connection } from './database/connection';

import { User, userGate } from './user';
import { authGate } from './auth';

const app = express();

app.use(bodyParser.json());


const combinedGates = async (req, res, next) => {
    const authed = await authGate(req, res);

    if (!authed) {
        return;
    }

    const isUser = await userGate(req, res);

    if (!isUser) {
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
    const user = new User(res, req.body);

    user.login();
});

app.get('/user', combinedGates, async (req, res) => {
    const user = new User(res, req.query)

    user.getById()
});

app.post('/user', (req, res) => {
    const user = new User(res, req.body);

    user.register();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    connect();
    console.log(`Server is running in http://localhost:${PORT}`)
});

process.on('SIGTERM', function () {
    console.log('\ncaught SIGTERM, stopping gracefully');
    process.exit(1);
});