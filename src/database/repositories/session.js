import Sequelize from 'sequelize';
const Op = Sequelize.Op;

import Session from '../models/session';

export class SessionReposistory {
    constructor(model) {
        this.model = model;
    }

    getSession(config) {
        return this.model.findOne({
            where: {
                [Op.or]: config
            }
        });
    }

    makeSession(config) {
        return this.model.create(config);
    }
    
    updateSession(config, updateConfig) {
        return this.model.update(updateConfig, config)
    }
}

export const DefaultSessionRepistory = () => {
    return new SessionReposistory(Session);
}