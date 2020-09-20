// set up all the modules
const inquirer = require('inquirer');
const fs = require('fs');
const util = require('util');
const ax = require('axios');
const chalk = require('chalk');
const figlet = require('figlet');
// const { get } = require('https');

const writeFileAsync = util.promisify(fs.writeFile);

// set up global vars
let username = '';
let data = [];

// get username from CLI, if none is given print useage and exit
function getUsername() {
    if (process.argv[2]) {
        return process.argv[2];
    }
    console.log("ERROR useage: node <script> <username>");
    process.exit();
}

//  perform axios api call to get the githu repos for the user specificed in the CLI args
function getRepos(user) {
    return ax.get(`https://api.github.com/users/${user}/repos`);
}


// function that has all the inquirer questions. 
function askQuestions() {

    return inquirer.prompt([{
            type: 'list',
            name: 'repo',
            message: 'Please pick a repo you want to create a readme for ',
            choices: data //uses the array returned from github API call. 
        },
        {
            type: 'input',
            name: 'title',
            message: 'Please enter a project title: ',
            default: ''
        },

        {
            type: 'editor',
            name: 'description',
            message: 'Project description: ',
            default: ''
        },

        {
            type: 'input',
            name: 'install',
            message: 'Please describe any install instructions: ',
            default: ''
        },
        {
            type: 'list',
            name: 'license',
            message: 'What type of License do you want to use',
            choices: ['MIT', 'GNU', "MPL 2.0", "Apache 2.0", "GPL 3.0"]
        },

        {
            type: 'input',
            name: 'contrib',
            message: 'Please list any contributors',
            default: ''
        },
        {
            type: 'input',
            name: 'useage',
            message: 'Please list any useage instructions',
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
            message: 'Please enter a email address for questions and feedback',
            default: ''
        }

    ]);

}
// string literal of the readme template. 
function generateReadme(answers) {
    return `
    
[![Generic badge](https://img.shields.io/static/v1?label=license&message=${answers.license.replace(/ /g,"%20")}&color=green&style=for-the-badge)](https://shields.io/) 
# Project name : ${answers.title.toUpperCase()}

[${answers.repo}](https://github.com/${username}/${answers.repo})
---
## Table of Contents

[Description](#description)...

[Installation Requirements](#installtion-requirments)...

[Useage](#useage)...

[License](#License)...

[Contribitors](#Contribitors)...

[Tests](#Tests)...

[Questions](#Questions)...

---
## Description
${answers.description}

---

## Installtion requirments
${answers.install}

---
## Useage
${answers.useage}

---
## License

${answers.license}

---
## Contribitors 

${answers.contrib}

---
## Tests
${answers.test}

---
## Questions
http://github.com/${username}

${answers.questions}

`
}



// initalize function for the script 
async function init() {

    try {
        // get username from CLI and query github for all the repos that belong to the user
        username = getUsername();
        console.log(chalk.yellow(figlet.textSync('GENERATE-README', { horizontalLayout: 'full' })));
        const repos = await getRepos(username);
        data = repos.data;

        // prompt user with quesitons
        const answers = await askQuestions();
        // create a var for  readmefile from the user answers provided, now stored inthe array answers
        const text = generateReadme(answers)
            // write the file using the text var
        await writeFileAsync('readme.md', text);

    } catch (error) {
        if (error.response.status === 404) {
            console.log(chalk.red(`USER NOT FOUND: ${error.response.status}/${error.response.statusText}`));
        } else { console.log(error); }






    }

}
// call the init function to start the script. 
init();