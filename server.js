const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: process.env.PORT || 3000 });

let clients = [];

wss.on('connection', function connection(ws) {
    console.log('Novo cliente conectado.');

    let clientData = { ws: ws, x: 0, y: 0 };
    clients.push(clientData);

    ws.on('message', function incoming(data) {
        const parsedData = JSON.parse(data);
        const x = parsedData.x;
        const y = parsedData.y;

        clientData.x = x;
        clientData.y = y;
        console.log(`Posição recebida: X=${x}, Y=${y}`);

        // Enviar a posição para os outros clientes
        clients.forEach(client => {
            if (client.ws !== ws) {
                client.ws.send(JSON.stringify({ x: x, y: y }));
            }
        });
    });

    ws.on('close', function() {
        console.log('Cliente desconectado.');
        clients = clients.filter(client => client.ws !== ws);
    });
});
