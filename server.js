require('dotenv').config();

const http = require('http');

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL,
        methods: ["GET", "POST"],
        allowedHeaders: ["deebaitheader"],
        credentials: true
    }
});

app.use(cors());
app.use(express.json());
app.use(helmet());

mongoose.connect(process.env.ATLAS_URL);

const connection = mongoose.connection;
connection.once('open', function() {
    console.log('Connection to MongoDB established successfully.')
});

const authenticationRouter = require('./routes/authentication.js');
const userControlsRouter = require('./routes/user-controls.js');

app.use('/authentication', authenticationRouter);
app.use('/user', userControlsRouter);

io.of('/chat').on('connection', function(socket) {
    require('./routes/socket-chat.js')(socket, io);
});

server.listen(process.env.PORT || 80);