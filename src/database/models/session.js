import Sequelize from 'sequelize';

import conn from '../connection.js';

const Session = conn.define('sessions', {
    // attributes
    expires_at: {
        type: Sequelize.DATE,
        allowNull: false
    },
    refresh_token: {
      type: Sequelize.SMALLINT,
      allowNull: false
    }
  });

export default Session;