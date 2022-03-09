/**
 * This is the schema definition for a Topic,
 * it is essentially a question where you can choose
 * between two pre-set answers used to match users
 */
const mongoose = require('mongoose');
const uuidv4 = require('uuid').v4;

const { Schema } = mongoose;

const topicSchema =  new Schema({
    topicID: {
        type: String,
        unique: true,
        minLength: 1,
        maxLength: 300,
        default: () => uuidv4(),
        required: true
    },
    question: {
        type: String,
        minLength: 1,
        maxLength: 300,
    },
    choices: [
        {
            choiceValue: {
                type: String,
                minLength: 1,
                maxLength: 300
            },
            choiceID: {
                type: String,
                minLength: 1,
                maxLength: 300,
                default: () => uuidv4()
            }
        }
    ],
    isLimitedTime: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model('Topic', topicSchema, 'topics');