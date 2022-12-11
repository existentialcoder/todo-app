'use strict';

const { Router } = require('express');

const todoRouter = new Router();

const {
    todosListController,
    todoCreateController,
    todoUpdateController,
    todoDetailsController,
    todoDeleteController
} = require('../controllers/todo.controllers');

todoRouter.get('/', todosListController);

todoRouter.get('/:id', todoDetailsController);

todoRouter.post('/', todoCreateController);

todoRouter.patch('/:id', todoUpdateController);

todoRouter.delete('/:id', todoDeleteController);

module.exports = todoRouter;
