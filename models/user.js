const mongoose = require('mongoose');
const uuidv4 = require('uuid').v4;

const { Schema } = mongoose;

const userSchema = new Schema({
    twitterID: {
        type: String,
        unique: true,
        minLength: 1,
        maxLength: 300,
        required: true
    },
    userID: {
        type: String,
        unique: true,
        minLength: 1,
        maxLength: 300,
        required: true,
        default: () => uuidv4()
    },
    topics: [
        { 
            topicID: {
                type: String,
                minLength: 1,
                maxLength: 300,
            }, 
            choiceID: {
                type: String,
                minLength: 1,
                maxLength: 300,
            }
        }
    ],
    pointsToSpend: {
        type: Number,
        default: 100
    },
    pointsReceived: {
        type: Number,
        default: 0
    },
    isBanned: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema, 'users');