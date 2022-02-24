require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');

const app = express();

app.use(cors());
app.use(express.json());
app.use(helmet());

mongoose.connect(process.env.ATLAS_URL);

const connection = mongoose.connection;
connection.once('open', function() {
    console.log('Connection to MongoDB established successfully.')
});

const authenticationRouter = require('./routes/authentication.js');

app.use('/authentication', authenticationRouter);

app.listen(process.env.PORT || 80);