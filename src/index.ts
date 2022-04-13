import './bootstrap';

import express from 'express';
import { DefaultUserRepository } from './repository/user';
import schema from './schema';

const app = express();

app.get('/user/:id', async (req: {
    params: {
        id: number
    }
}, res) => {
    const userRepo = DefaultUserRepository(res);

    const user = await userRepo.getUser(+req.params.id);
    user.send();
});

app.listen(9001, () => {
    schema();
});