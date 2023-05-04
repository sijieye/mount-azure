const jsonServer = require('json-server');
const jsserver = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const express = require('express');

const server = express();

jsserver.use(middlewares);
jsserver.use(router);

server.use('/', jsserver);

server.listen(3001);