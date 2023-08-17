import { EventEmitter } from 'events';
import { createServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';

import app from './src/App/app';

const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, {
    cors: {
        origin: ['http://localhost:3000', 'http://localhost:5100'],
        methods: ['GET', 'POST', "PUT', 'DELETE", "PATCH"],
        credentials: true,
        optionsSuccessStatus: 200
    },
});

const eventEmitter = new EventEmitter();

// app.set('eventEmitter', eventEmitter);
app.set('socketio', io);
io.on('connection', (socket: Socket) => {
    console.log('a user connected');
});

const port = 8000;
httpServer.listen(port, () => {
    console.log(`Server run on port http://localhost:${port}`);
});
