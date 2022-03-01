const mongoose = require('mongoose');
const uuidv4 = require('uuid').v4;

const { Schema } = mongoose;

const threadSchema = new Schema({
    threadID: {
        type: String,
        unique: true,
        minLength: 1,
        maxLength: 300,
        required: true,
        default: () => uuidv4()
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
            senderID: {
                type: String,
                minLength: 1,
                maxLength: 300
            },
            messageValue: {
                type: String,
                minLength: 1,
                maxLength: 300
            }
        }
    ]
}, { timestamps: true });

// a thread gets auto deleted after 48 hours
threadSchema.index({ createdAt: 1 }, { expires: '48h' });
module.exports = mongoose.model('Thread', threadSchema, 'threads');