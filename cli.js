require('dotenv').config();

const { Command } = require('commander');
const mongoose = require('mongoose');

const User = require('./models/user.js');
const Topic = require('./models/topic.js');

mongoose.connect(process.env.ATLAS_URL);

const program = new Command();

program
    .name('Deebait AdminTool@CLI')
    .description('This CLI tool allows control and manipulation of Deebait database.')
    .version('0.1.0');

program
    .command('add-topic')
    .description('Add a topic in the database.')
    .argument('<question>', 'The question at hand.')
    .argument('<choiceA>', 'The first choice.')
    .argument('<choiceB>', 'The second choice.')
    .argument('<isLimitedTime>', 'Whether the question is limited time or not')
    .action((question, choiceA, choiceB, isLimitedTime) => {
        new Topic({
            question,
            choices: [ 
                { choiceValue: choiceA }, 
                { choiceValue: choiceB }
            ],
            isLimitedTime: isLimitedTime == 'true'
        }).save(function(error, topic) {
            if (error) return console.log(`Failed operation:\n${prettifyJSON(error)}`);
            console.log(`Successfully added entry on topics:\n${prettifyJSON(topic)}`);
            
            mongoose.disconnect();
            process.exit();
        });
    });

program
    .command('remove-fake')
    .description('Remove fake user created for testing.')
    .action(() => {
        User.deleteMany({ googleEmail: { $regex: /[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89aAbB][a-f0-9]{3}-[a-f0-9]{12}/ } })
        .then(function(info){
            console.log(`${info.deletedCount} fake users removed!`);
        });
    });
    


function prettifyJSON(object) {
    return JSON.stringify(object, null, 2);
}

program.parse();

