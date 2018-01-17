"use strict";

const webSocketsServerPort = 1337;

const webSocketServer = require('websocket').server;
const http = require('http');

const history = [];
const clients = [];

const users = [];

const colors = [ 'red', 'green', 'blue', 'magenta', 'purple', 'plum', 'orange' ];
colors.sort(function(a,b) { return Math.random() > 0.5; } );

let user, index;

const server = http.createServer((request, response) => {});
server.listen(webSocketsServerPort, function() {
  users.length = 0;
  console.log((new Date()) + " Server is listening on port "
    + webSocketsServerPort);
});

const wss = new webSocketServer({
  httpServer: server
});

wss.on('request', function(request) {
  console.log((new Date()) + ' Connection from origin '
    + request.origin + '.');

  const connection = request.accept(null, request.origin);

  index = clients.push(connection) - 1;
  console.log((new Date()) + ' Connection accepted.');
  // send back chat history
  if (history.length > 0) {
    connection.sendUTF(
      JSON.stringify({ type: 'history', data: history} ));
  }
  // user sent some message
  connection.on('message', function(message) {
    if (message.type === 'utf8') {
      const data = JSON.parse(message.utf8Data);
      if (data.type === 'login') {
        user = {userpic: data.message, userColor: colors.shift()};
        users.push(user);
        wss.broadcast(JSON.stringify({data: users, type: 'user'}));
      }
    }
  });
  // user disconnected
  connection.on('close', function(connection) {
    if (user) {
      console.log((new Date()) + " Peer "
        + connection.remoteAddress + " disconnected.");
      // remove user from the list of connected clients
      clients.splice(index, 1);
      users.splice(index, 1);
      wss.broadcast(JSON.stringify({data: users, type: 'user'}));
      // push back user's color to be reused by another user
      colors.push(user.userColor);
    }
  });
});