'use strict';

const { createUser } = require('../models/users.model');

function getUserDetails(req) {
    return req.meta.userDetails;
}

/**
 * Signup user
 */
async function userCreateController(req, res) {
    console.info('Creating user for user signup request');

    const userDetails = getUserDetails(req);

    const result = await createUser(userDetails);

    if (result) {
        const msg = `Successfully created user with email - ${userDetails.email}`;
    
        console.info(msg)
        res.status(201).send({
            message: msg
        });
    }
}

function userGetController(req, res) {
    return res.status(200).send({ user: { email: req.meta.userDetails.email } });
}


module.exports = {
    userCreateController,
    userGetController
};
