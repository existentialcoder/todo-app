'use strict';

const { Router } = require('express');

const { userCreateController, userGetController } = require('../controllers/users.controllers');

const { authUserSignupMiddleware, authCheckMiddleware } = require('../middlewares/auth.middleware');

const usersRouter = new Router();

usersRouter.post('/', [authUserSignupMiddleware], userCreateController);
usersRouter.get('/', [authCheckMiddleware], userGetController);

module.exports = usersRouter;
