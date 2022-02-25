const mongoose = require('mongoose');
const uuidv4 = require('uuid').v4;
const uniqueValidator = require('mongoose-unique-validator');

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
                default: uuidv4()
            }
        }
    ]

}, { timestamps: true });

topicSchema.plugin(uniqueValidator);
module.exports = mongoose.model('Topic', topicSchema, 'topics');