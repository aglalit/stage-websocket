const http         = require('http'),
      fs           = require('fs'),
      path         = require('path'),
      contentTypes = require('./utils/content-types'),
      sysInfo      = require('./utils/sys-info'),
      env          = process.env;

// // let server = http.createServer(function (req, res) {
// //   let url = req.url;
// //   if (url == '/') {
// //     url += 'index.html';
// //   }
//
//   // IMPORTANT: Your application HAS to respond to GET /health with status 200
//   //            for OpenShift health monitoring
//
//   if (url == '/health') {
//     res.writeHead(200);
//     res.end();
//   } else if (url == '/info/gen' || url == '/info/poll') {
//     res.setHeader('Content-Type', 'application/json');
//     res.setHeader('Cache-Control', 'no-cache, no-store');
//     res.end(JSON.stringify(sysInfo[url.slice(6)]()));
//   } else {
//     fs.readFile('./static' + url, function (err, data) {
//       if (err) {
//         res.writeHead(404);
//         res.end('Not found');
//       } else {
//         let ext = path.extname(url).slice(1);
//         res.setHeader('Content-Type', contentTypes[ext]);
//         if (ext === 'html') {
//           res.setHeader('Cache-Control', 'no-cache, no-store');
//         }
//         res.end(data);
//       }
//     });
//   }
// });
//
// server.listen(env.NODE_PORT || 3000, env.NODE_IP || 'localhost', function () {
//   console.log(`Application worker ${process.pid} started...`);
// });
var WebSocket = require('ws'),
WebSocketServer = WebSocket.Server,
wss = new WebSocketServer({host:ipaddress, port:8080}),
clients = [],
console.log(env.NODE_IP);
ipaddress = env.NODE_IP || 'localhost',
port = env.NODE_PORT || 3000;

wss.on('connection', function(ws) {
var client_uuid = uuidV4();
clients.push({"id": client_uuid, "ws": ws});
console.log(clients.length);
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
console.log(message);
clients.forEach(function(client){
 var clientSocket = client.ws;
 console.log('client [%s]: %s', client.id, message);
 if (clientSocket.readyState === WebSocket.OPEN) clientSocket.send(message)})
});
});
