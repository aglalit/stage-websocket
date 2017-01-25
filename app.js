const env = process.env,
// uuidV4 = require('uuid/v4');
//
// var WebSocket = require('ws'),
// WebSocketServer = WebSocket.Server,
// clients = [],
// ipaddress = env.NODE_IP || 'localhost',
// wss = new WebSocketServer({host:ipaddress, port:8080,
// });
//
// wss.on('connection', function(ws) {
// var client_uuid = uuidV4();
// clients.push({"id": client_uuid, "ws": ws});
// console.log(clients);
// console.log('client [%s] connected', client_uuid);
//
// ws.on('close', function() {
// for(var i=0; i<clients.length; i++) {
//  if(clients[i].id == client_uuid) {
//       console.log('client [%s] disconnected', client_uuid);
//       clients.splice(i, 1);
//  }
// }
// });
// ws.on('message', function(message) {
// console.log(message);
// // clients.forEach(function(client){
// //  var clientSocket = client.ws;
// //  console.log('client [%s]: %s', client.id, message);
// //  if (clientSocket.readyState === WebSocket.OPEN) clientSocket.send(message)})
// });
// setInterval(function(){ws.send('fsdfs')},2000)
//
// });
var WebSocketServer = require('websocket').server;
var WebSocketClient = require('websocket').client;
var WebSocketFrame  = require('websocket').frame;
var WebSocketRouter = require('websocket').router;
var W3CWebSocket = require('websocket').w3cwebsocket;

#!/usr/bin/env node
var WebSocketServer = require('websocket').server;
var http = require('http');

var server = http.createServer(function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});
server.listen(8080, function() {
    console.log((new Date()) + ' Server is listening on port 8080');
});

wsServer = new WebSocketServer({
    httpServer: server,
    // You should not use autoAcceptConnections for production
    // applications, as it defeats all standard cross-origin protection
    // facilities built into the protocol and the browser.  You should
    // *always* verify the connection's origin and decide whether or not
    // to accept it.
    autoAcceptConnections: false
});

function originIsAllowed(origin) {
  // put logic here to detect whether the specified origin is allowed.
  return true;
}

wsServer.on('request', function(request) {
    if (!originIsAllowed(request.origin)) {
      // Make sure we only accept requests from an allowed origin
      request.reject();
      console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
      return;
    }

    var connection = request.accept('echo-protocol', request.origin);
    console.log((new Date()) + ' Connection accepted.');
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log('Received Message: ' + message.utf8Data);
            connection.sendUTF(message.utf8Data);
        }
        else if (message.type === 'binary') {
            console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
            connection.sendBytes(message.binaryData);
        }
    });
    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});
