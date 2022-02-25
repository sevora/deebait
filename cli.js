require('dotenv').config();

const { Command } = require('commander');
const mongoose = require('mongoose');

const Topic = require('./models/topic.js');

mongoose.connect(process.env.ATLAS_URL);

const program = new Command();

program
    .name('Deebait AdminTool@CLI')
    .description('This CLI tool allows control and manipulation of Deebait database.')
    .version('0.1.0');

program
    .command('topic-add')
    .description('Add a topic in the database.')
    .argument('<question>', 'The question at hand.')
    .argument('<choiceA>', 'The first choice.')
    .argument('<choiceB>', 'The second choice.')
    .action((question, choiceA, choiceB) => {
        new Topic({
            question,
            choices: [ 
                { choiceValue: choiceA }, 
                { choiceValue: choiceB }
            ]
        }).save(function(error, topic) {
            if (error) return console.log(`Failed operation:\n${prettifyJSON(error)}`);
            console.log(`Successfully added entry on topics:\n${prettifyJSON(topic)}`);
            
            mongoose.disconnect();
            process.exit();
        });
    });

function prettifyJSON(object) {
    return JSON.stringify(object, null, 2);
}

program.parse();

