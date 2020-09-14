var inquirer = require('inquirer');

// array of questions for user
const questions = [

];

// function to write README file
function writeToFile(fileName, data) {}


function askQuestions() {
    inquirer.prompt([{
                type: 'input',
                name: 'title',
                message: 'What is the title of your project?',
                default: ''
            },

            {
                type: 'input',
                name: 'description',
                message: 'Please descript your project',
                default: ''
            },

            {
                type: 'input',
                name: 'install',
                message: 'Please describe any install instructions',
                default: ''
            },
            {
                type: 'list',
                name: 'license',
                message: 'What type of License do you want to use',
                choices: ['MIT', 'GNU']
            },

            {
                type: 'input',
                name: 'contrib',
                message: 'Please list any contributors',
                default: ''
            },

            {
                type: 'input',
                name: 'test',
                message: 'Please describe your testing',
                default: ''
            },

            {
                type: 'input',
                name: 'questions',
                message: 'please enter a email address for questions and feedback',
                default: ''
            }

        ])
        .then(answers => {
            console.log("here are the answers \n" + answers);
        })
        .catch(error => {
            if (error.isTtyError) {
                console.log(error);
            } else {
                console.log(error);
            }
        });

}
// function to initialize program
function init() {
    askQuestions();

}

// function call to initialize program
init();