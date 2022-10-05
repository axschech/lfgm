import './bootstrap';

import express from 'express';
import * as bodyParser from 'body-parser';

import { DefaultUserRepository, UserRepository } from './repository/user';
import schema from './schema';
import { combinedGates } from './gate';

const app = express();

app.use(bodyParser.json());

app.get('/user/:id', combinedGates, async (req: {
    params: {
        id: number
    }
}, res) => {
    const userRepo = DefaultUserRepository(res);

    const user = await userRepo.getUser(+req.params.id);
    user.send();
});

app.post('/user', async (req: {
    body?: {
        username: string;
        email: string;
        password: string;
    }
}, res) => {
    const userRepo = DefaultUserRepository(res);

    const user = await userRepo.registerUser(req.body)
    user.send();
})

app.listen(9001, async () => {
    console.log(await schema());
});