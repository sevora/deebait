const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const { Schema } = mongoose;

const threadSchema = new Schema({
    threadID: {
        type: String,
        unique: true,
        minLength: 1,
        maxLength: 300,
        required: true
    },
    participantIDs: [
        {
           type: String,
            minLength: 1,
            maxLength: 300
        }
    ],
    messages: [
        {
            type: String,
            minLength: 1,
            maxLength: 300
        }
    ]
}, { timestamps: true });