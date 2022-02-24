require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

const app = express();
mongoose.connect(process.env.ATLAS_URL);

const connection = mongoose.connection;
connection.once('open', function() {
    console.log('Connection to MongoDB established successfully.')
});

app.listen(process.env.PORT || 80);