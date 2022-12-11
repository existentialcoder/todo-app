'use strict';

const { promisify } = require('util')

const promisifiedQuery = promisify(global.mysqlConnectionPool.query).bind(global.mysqlConnectionPool);

async function createUser(userDetails) {
    const query = `insert into users values (NULL, "${userDetails.email}", "${userDetails.password}", NULL);`;

    const result = await promisifiedQuery(query);

    if (result) {
        return true;
    }
}


module.exports = {
    createUser
};
