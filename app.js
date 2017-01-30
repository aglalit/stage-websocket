const env = process.env,
uuidV4 = require('uuid/v4');

var WebSocket = require('ws'),
WebSocketServer = WebSocket.Server,
clients = [],
ipaddress = env.NODE_IP || 'localhost',
wss = new WebSocketServer({host:ipaddress, port:8080,
});

wss.on('connection', function(ws) {
ws.send(Date.now())

var client_uuid = uuidV4();
clients.push({"id": client_uuid, "ws": ws});
console.log('client [%s] connected', client_uuid);

ws.on('close', function() {
for(var i=0; i<clients.length; i++) {
 if(clients[i].id == client_uuid) {
      console.log('client [%s] disconnected', client_uuid);
      clients.splice(i, 1);
 }
}
});
ws.on('message', function(message) {
//if (message == "PING") ws.send(Date.now());
clients.forEach(function(client){
 var clientSocket = client.ws;
 //console.log('client [%s]: %s', client.id, message);
 if (clientSocket.readyState === WebSocket.OPEN) clientSocket.send(message)})
});

});
