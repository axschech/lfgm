import Sequelize from 'sequelize';

import User from '../models/user';
import bcrypt from 'bcrypt';

const Op = Sequelize.Op;

export class UserRepository {
    constructor(model) {
        this.model = model;
    }
    
    register(config) {
        return this.model.create({
            user: config.user,
            email: config.email,
            password: config.password
        });
    }
    
    login(config) {
        let promise = new Promise((resolve, reject) => {
            this.model.findOne({
                where: {
                    [Op.or]: [{user: config.user || null}, {email: config.email || null}]
                }
            }).then(user => {
                if (user === null) {
                    reject();
                }
                bcrypt.compare(config.password, user.password, (err, res) => {
                    if (res) {
                        resolve()
                        return;
                    }
                   reject();
                })
            })
        });

        return promise;
    }
}

export const DefaultUserFactory = () => {
    return new UserRepository(User);
}
