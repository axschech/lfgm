import Sequelize from 'sequelize';

import conn from '../connection.js';
import bcrypt from 'bcrypt';

import Session from './session';

const User = conn.define('users', {
    // attributes
    user: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    }
  }, {
    hooks: {
        beforeCreate: (user, options) => {
            return bcrypt.hash(user.password, 10).then((hash) => {
                user.password = hash;
            })
        }
    },
    indexes: [
        {
            unique: true,
            fields: [
                'user', 
                'email'
            ]
        }
    ]
  });

User.hasMany(Session, {
    foreignKey: 'user_id'
});

export default User;