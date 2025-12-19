// server.js
const WebSocket = require('ws');

// Create WebSocket server on port 8080
const wss = new WebSocket.Server({ port: 8080 }, () => {
    console.log("WebSocket server running on ws://localhost:8080");
});

wss.on('connection', (ws) => {
    console.log("New client connected");

    ws.on('message', (message) => {
        console.log("Received:", message.toString());

        // Broadcast the message to all clients
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message.toString());
            }
        });
    });

    ws.on('close', () => {
        console.log("Client disconnected");
    });

    ws.send(JSON.stringify({ user: "Server", msg: "Welcome to the chat!" }));
});
