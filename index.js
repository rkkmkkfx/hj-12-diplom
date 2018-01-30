"use strict";

const jsonServer = require('json-server');
const apiServer = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

const apiPort = process.env.PORT || 3000;

apiServer.use(middlewares);
apiServer.use(router);
apiServer.listen(apiPort, () => {
  console.log('JSON Server is running')
});