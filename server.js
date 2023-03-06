/**
 * This is the main server script for Deebait
 * Check out README.md for environment variables necessary for this
 * script
 */
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

// mongoose handles everything by pushing everything to a global queue, that's why 
// it knows where to save things even if I don't import the model and set it up here
mongoose.connect(process.env.ATLAS_URL);

const authenticationRouter = require('./routes/authentication.js');
const userControlsRouter = require('./routes/user-controls.js');

// normal routes
app.use('/authentication', authenticationRouter);
app.use('/user', userControlsRouter);

app.get('/public/connections', function(request, response) {
    response.status(200).json({ connected: io.engine.clientsCount });
});

// websockets
io.of('/chat').on('connection', function(socket) {
    require('./sockets/chat.js')(socket, io);
});

app.use((e,req,res,next) => {
    const {statusCode,message,data} = e;
    res.status(statusCode).json({message,data});
})

const connection = mongoose.connection;

// only start the server once database connection is open
connection.once('open', function() {
    server.listen(process.env.PORT || 80); 
    console.log('Successfully connected to MongoDB and started server on specified port!');
});