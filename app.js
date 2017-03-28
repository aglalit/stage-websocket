const env = process.env,
    uuidV4 = require('uuid/v4'),
    now = require("performance-now"),
    midi = require('midi'),
    websocket = require('ws'),
    websocketServer = websocket.Server,
    clients = [],
    ipaddress = env.NODE_IP || 'localhost',
    wss = new websocketServer({host: '192.168.2.1', port: 8080, perMessageDeflate: false});

wss.on('connection', function(ws) {
    var client_uuid = uuidV4();
    clients.push({"uuid": client_uuid, "ws": ws, 'pings': []});
    console.log('client [%s] connected', client_uuid);

    ws.on('close', function() {
        for (var i = 0; i < clients.length; i++) {
            if (clients[i].id == client_uuid) {
                console.log('client [%s] disconnected', client_uuid);
                clients.splice(i, 1);
            }
        }
    });
    ws.on('message', function(message) {
        // if (message.split(',').length == 3) {
        //     clients.forEach(function(client) {
        //         var clientSocket = client.ws;
        //         if (clientSocket.readyState === websocket.OPEN)
        //             clientSocket.send(message)
        //     })
        // } else
        // if (message.split('###').length == 3) {
        //     var parsedPing = message.split('###');
        //     var pings = clients[parsedPing[1]].pings;
        //     pings[parsedPing[2]] = now() - pings[parsedPing[2]];
        //     if (pings.length < 20) {
        //         clients[parsedPing[1]].ws.send(client_uuid + '###' + parsedPing[1] + '###' + pings.length); //UUID ### CLIENT ID ### PING NUMBER
        //         pings.push(now());
        //     } else if (pings.length == 20) {
        //         var sum = pings.reduce(function(a, b) {
        //             return a + b
        //         }, 0);
        //         clients[parsedPing[1]].ws.send(Math.round((Date.now() + sum / 40)).toString());
        //         console.log('pinging of %s done', clients[parsedPing[1]].uuid);
        //     }
        // } else {
        //     for (var i = 0; i < clients.length; i++) {
        //         if (clients[i].uuid == client_uuid) {
        //             var client = clients[i];
        //             if (message == 'CanYouPingMe') {
        //                 client.ws.send('YeahBaby');
        //             } else if (message == 'PingMeNow') {
        //                 client.ws.send(client_uuid + '###' + i.toString() + '###' + 0); //UUID ### CLIENT ID ### PING NUMBER
        //                 client.pings.push(now());
        //             }
        //
        //         }
        //     }
        // }
    });
});

setInterval(function() {
    clients.forEach(function(client) {
        var clientSocket = client.ws;
        if (clientSocket.readyState === websocket.OPEN)
            clientSocket.ping()
    })
}, 20)

var input = new midi.input();
input.on('message', function(deltaTime, message) {
    // The message is an array of numbers corresponding to the MIDI bytes:
    //   [status, data1, data2]
    // https://www.cs.cf.ac.uk/Dave/Multimedia/node158.html has some helpful
    // information interpreting the messages.
    //console.log('m:' + message + ' d:' + deltaTime);
    var strMsg = message.toString();
    console.log(message);
    clients.forEach(function(client) {
        var clientSocket = client.ws;
        if (clientSocket.readyState === websocket.OPEN)
        client.ws.send(strMsg)
    })
});

function portsList(io){
    for (i=0; i<io.getPortCount();i++){
        console.log(io.getPortName(i))
    }
}
//input.getPortCount();
//input.getPortName(0);
//input.ignoreTypes(false, false, false);
input.openPort(1);
var abletonInput = new midi.input();
abletonInput.openVirtualPort("Node.js Input from Ableton");
abletonInput.on('message', function(deltaTime, message) {
       console.log(message);
    var strMsg = message.toString();
    // output.sendMessage(message);
    clients.forEach(function(client) {
        var clientSocket = client.ws;
        if (clientSocket.readyState === websocket.OPEN)
            client.ws.send(strMsg)
    })
});

// var abletonOutput = new midi.output();
// abletonOutput.openVirtualPort("Node.js Output to Ableton");
portsList(abletonInput);
