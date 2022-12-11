'use strict';

const zlib = require('zlib');

const { getUserDetails } = require('../models/todo.model');

const handleUnauthError = (res) => res.status(401).send({
    message: 'Authentication Error'
});

const emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

async function authCheckMiddleware(req, res, next) {
  const auth = req.headers.authorization;

  if (!auth) {
    console.error('No auth header found');
    return handleUnauthError(res);
  }

  const [authSchema, encodedKey] = auth.split(' ');

  if (authSchema !== 'Basic') {
    console.error('Wrong auth schema');
    return handleUnauthError(res);
  }

  const [userEmail, password] = atob(encodedKey).split(':');

  if (!emailRegex.test(userEmail)) {
    console.error('Invalid value for user email');
    return handleUnauthError(res);
  }

  const userDetails = await getUserDetails(userEmail);

  if (!userDetails) {
    console.error('User not found');
    return handleUnauthError(res);
  }

  const targetPassword = zlib.inflateSync(Buffer.from(userDetails.password, 'hex')).toString();

  if (password !== targetPassword) {
    console.error('Password check failed');
    return handleUnauthError(res);
  }

  req.meta = { userDetails };

  next();
}

async function authUserSignupMiddleware(req, res, next) {
    const auth = req.headers.authorization;

    if (!auth) {
      console.error('No auth header found');
      return handleUnauthError(res);
    }
  
    const [authSchema, encodedKey] = auth.split(' ');
  
    if (authSchema !== 'Basic') {
      console.error('Wrong auth schema');
      return handleUnauthError(res);
    }
  
    const [userEmail, password] = atob(encodedKey).split(':');

    if (!emailRegex.test(userEmail)) {
      console.error('Invalid value for user email');
      return handleUnauthError(res);
    }

    const userDetails = await getUserDetails(userEmail);

    if (userDetails) {
      console.error('User already exists');
      return res.status(409).send({ message: 'User already exists' });
    }

    const targetPassword = zlib.deflateSync(password).toString('hex');

    req.meta = {
      userDetails: {
        email: userEmail,
        password: targetPassword
      }
    };

    next();
}



module.exports = {
  authCheckMiddleware,
  authUserSignupMiddleware
};
