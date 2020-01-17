import Sequelize from 'sequelize';

import User from '../models/user';
import bcrypt from 'bcrypt';

const Op = Sequelize.Op;

export class UserRepository {
    constructor(model) {
        this.model = model;
    }
    
    getUserById(id) {
        return this.model.findByPk(id);
    }

    getUser(config) {
        return this.model.findOne({
            where: {
                [Op.or]: config
            }
        });
    }

    register(config) {
        return this.model.create(config);
    }
    
    login(config) {
        let promise = new Promise((resolve, reject) => {
            this.getUser(config).then(user => {
                if (user === null) {
                    reject();
                }
                bcrypt.compare(config.password, user.password, (err, res) => {
                    if (res) {
                        resolve({id: user.id})
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
