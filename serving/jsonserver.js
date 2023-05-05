const jsonServer = require('json-server');
const jsserver = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const express = require('express');
const cors = require('cors');

const server = express();

jsserver.use(middlewares);
jsserver.use(router);

server.use('/', jsserver);
server.use(cors({
    origin: "*"
}))
server.options('*', cors())
server.listen(3001);