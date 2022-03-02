require('dotenv').config();
const mongoose = require('mongoose');

const Thread = require('./models/thread.js');

new Thread().save(function(error, topic) {
    if (error) return console.log(`Failed operation:\n${prettifyJSON(error)}`);
    console.log(`Successfully added entry on topics:\n${prettifyJSON(topic)}`);
    
    mongoose.disconnect();
    process.exit();
});

function prettifyJSON(object) {
    return JSON.stringify(object, null, 2);
}

mongoose.connect(process.env.ATLAS_URL);

