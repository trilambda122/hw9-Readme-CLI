const inquirer = require('inquirer');
const fs = require('fs');
const util = require('util');

const writeFileAsync = util.promisify(fs.writeFile);

function askQuestions() {

    return inquirer.prompt([{
            type: 'input',
            name: 'title',
            message: 'Project Title: ',
            default: ''
        },

        {
            type: 'input',
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

function generateReadme(answers) {
    return `
    
[![Generic badge](https://img.shields.io/static/v1?label=license&message=${answers.license.replace(/ /g,"%20")}&color=green&style=for-the-badge)](https://shields.io/) 
# Project name : ${answers.title.toUpperCase()}

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
${answers.description}

`


}




async function init() {
    console.log("starting the init function");
    try {
        const answers = await askQuestions();

        const text = generateReadme(answers)

        await writeFileAsync('readme.md', text);

    } catch (error) {
        console.log(error);


    }

}

init();