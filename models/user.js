/**
 * This is the User Schema Definition
 * Literally, a user in the site.
 */
const mongoose = require('mongoose');
const uuidv4 = require('uuid').v4;

const { Schema } = mongoose;

const userSchema = new Schema({
    googleEmail: {
        type: String,
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
    isBanned: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema, 'users');