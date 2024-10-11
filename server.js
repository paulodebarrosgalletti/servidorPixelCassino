const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: process.env.PORT || 3000 });

let clients = [];

// Quando um cliente se conecta
wss.on('connection', function connection(ws) {
    console.log('Novo cliente conectado.');

    // Dados de cada cliente (socket e posição inicial)
    let clientData = { ws: ws, x: 0, y: 0 };
    clients.push(clientData);

    // Recebendo mensagens do cliente
    ws.on('message', function incoming(data) {
        try {
            // Tente converter os dados recebidos em um objeto
            const parsedData = JSON.parse(data);
            const x = parsedData.x;
            const y = parsedData.y;

            // Atualiza a posição do cliente
            clientData.x = x;
            clientData.y = y;
            console.log(`Posição recebida: X=${x}, Y=${y}`);

            // Enviar a posição do cliente para todos os outros clientes conectados
            clients.forEach(client => {
                if (client.ws !== ws) {
                    client.ws.send(JSON.stringify({ x: x, y: y }));
                }
            });
        } catch (error) {
            console.error('Erro ao processar a mensagem recebida: ', error);
        }
    });

    // Quando o cliente se desconecta
    ws.on('close', function() {
        console.log('Cliente desconectado.');
        clients = clients.filter(client => client.ws !== ws);  // Remover cliente desconectado
    });

    // Tratamento de erro na conexão
    ws.on('error', function (error) {
        console.error('Erro na conexão com o cliente: ', error);
    });
});

// Log para verificar que o servidor está rodando
console.log(`Servidor WebSocket rodando na porta ${process.env.PORT || 3000}`);
