'use strict';

const {
    getAllTodos, getTodoDetails,
    createTodo, updateTodo, deleteTodo
} = require('../models/todo.model');

function getUserDetails(req) {
    return req.meta.userDetails;
}

/**
 * List all todos
 */
async function todosListController(req, res) {
    const userDetails = getUserDetails(req);

    console.info(`Listing all todos for user with email : ${userDetails.email}`);

    const allUserTodos = await getAllTodos(userDetails.id);

    res.status(200).send({
        todos: allUserTodos
    });
}

/**
 * Get a single todo details
 */
async function todoDetailsController(req, res) {
    console.info(`Getting todo details for id : ${req.params.id}`);

    const result = await getTodoDetails(req.params.id);

    if (result) {
        res.status(200).send(result);
    }
}

/**
 * Create a todo
 */
async function todoCreateController(req, res) {
    const { body } = req;

    console.info(`Creating todo details for user with body : ${JSON.stringify(body)}`);

    const isValidPayload = (body.title && body.title.length > 0);

    if (!isValidPayload) {
        return res.status(400).send({ message: 'Invalid / missing fields. Please fill out title and desc of todo' });
    }

    const result = await createTodo(req.meta.userDetails.id, body);

    if (result) {
        res.status(201).send({
            message: 'Successfully created todo',
            body
        });
    }
}


/**
 * Update a todo
 */
async function todoUpdateController(req, res) {
    const { body } = req;

    console.info(`Updating todo details for user with body : ${JSON.stringify(body)}`);

    if (body.title || body.description || typeof body.completed === 'boolean') {
        const result = await updateTodo(req.params.id, body);

        if (result) {
            return res.status(200).send({
                message: 'Successfully updated todo',
                body
            });
        }
    }

    return res.status(400).send({ message: 'Nothing valid to update' });
}

/**
 * Delete a todo
 */
 async function todoDeleteController(req, res) {
    console.info('Deleting todo details');

    const result = await deleteTodo(req.params.id);

    if (result) {
        return res.status(202).send({
            message: 'Successfully deleted todo'
        });
    }
}



module.exports = {
    todosListController,
    todoDetailsController,
    todoCreateController,
    todoUpdateController,
    todoDeleteController
};
