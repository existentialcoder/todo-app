'use strict';

const { promisify } = require('util');

const promisifiedQuery = promisify(global.mysqlConnectionPool.query).bind(global.mysqlConnectionPool);

async function getUserDetails(email) {
    const query = `select * from users where email="${email}"`;

    const result = await promisifiedQuery(query);

    if (result[0]) {
        return {
            id: result[0].id,
            email: result[0].email,
            password: result[0].password,
            created_at: result[0].created_at
        };
    }
}


async function getAllTodos(userId) {
    const query = `select * from todos where user_id=${userId}`;

    const result = await promisifiedQuery(query);

    if (result) {
        debugger
        return result.map(todo => ({ ...todo, completed: todo.completed === 1 }));
    }
}

async function getTodoDetails(todoId) {
    const query = `select * from todos where id=${todoId}`;

    const result = await promisifiedQuery(query);

    if (result[0]) {
        return {
            ...result[0],
            completed: result[0].completed === 1
        };
    }
}

async function createTodo(userId, todoPayload) {
    const query = `insert into todos (user_id, title, description, completed) values ("${userId}", "${todoPayload.title}", "${todoPayload.description || null}", 0)`;

    const result = await promisifiedQuery(query);

    if (result) {
        return true;
    }
} 

async function updateTodo(todoId, todoPayload) {
    const { title, description, completed } = todoPayload;

    const query = `update todos set ${title ? `title="${title}",` : ''}  ${description ? `description="${description},"` : ''} ${typeof completed === 'boolean' ? `completed=${completed ? 1 : 0}` : ''} where id=${todoId}`;

    const result = await promisifiedQuery(query);

    if (result) {
        return true;
    }
}

async function deleteTodo(todoId) {
    const query = `delete from todos where id=${todoId}`;

    const result = await promisifiedQuery(query);

    if (result) {
        return true;
    }
}

module.exports = {
    getUserDetails,
    getAllTodos,
    getTodoDetails,
    createTodo,
    updateTodo,
    deleteTodo
};
