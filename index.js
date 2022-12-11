'use strict';

const express = require('express');

const { promisify } = require('util');

function setMysqlConnection() {
  const mysql = require('mysql');

  const mysqlConfigs = {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER_NAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB
  };

  global.mysqlConnectionPool = mysql.createPool(mysqlConfigs);
}

function enableCORS(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,PATCH,DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");

  if(req.method === 'OPTIONS') {
    res.status(201);
    return res.end();
  }

  next();
}

/**
 * Listen to a specific port
 */
 function listen() {
  const app = express();

  const todoRouter = require('./lib/routes/todo.routes');

  const usersRouter = require('./lib/routes/users.routes');

  const { authCheckMiddleware } = require('./lib/middlewares/auth.middleware');

  app.use([enableCORS, express.json()]);

  app.use('/api/users', usersRouter);
  app.use('/api/todos', authCheckMiddleware, todoRouter);


  app.listen(process.env.PORT, () => {
    console.info(`Server started at port ${process.env.PORT}`);
  });
}

/**
 * Starts server
 */
async function startServer() {
  const PORT = process.env.PORT;
  console.info(`Starting server at port ${PORT}`);
  try {
    setMysqlConnection();
    listen();
  }
  catch (error) {
    console.error(`Error while trying to start server - ${error.message}`);
    console.info('Exiting the service');
    const promisifiedConnectionEnd = promisify(global.mysqlConnectionPool.end).bind(global.mysqlConnectionPool);
    await promisifiedConnectionEnd();
    process.exit(1);
  }
}

startServer();
