// set up all the modules
const inquirer = require('inquirer');
const fs = require('fs');
const util = require('util');
const ax = require('axios');
const chalk = require('chalk');
const figlet = require('figlet');

// setup for write file
const writeFileAsync = util.promisify(fs.writeFile);
// set up global vars
let username = '';
let screenShotDir = ''
let data = [];
let screenShotFiles = [];


// get username from CLI, if none is given print useage and exit
function getUsername() {
    if (process.argv[2]) {
        return process.argv[2];
    }
    console.log(chalk.red("ERROR useage: node <script> <github username> <directory of screenshots>"));
    process.exit();
}
// get the optional screen shot directory if supplied, if not just return
function getDir() {
    if (process.argv[3]) {
        return process.argv[3];
    }
    return
}

//  perform axios api call to get the githu repos for the user specificed in the CLI args
function getRepos(user) {
    return ax.get(`https://api.github.com/users/${user}/repos`);
}

// check file extentions using Regex for jpeg png and gifs types
function checkForImageFiles(fileNames) {
    images = [];
    fileNames.forEach(function(file) {
        if (file.match(/[^/]+(jpg|png|gif)$/)) {
            images.push(file);
        }
    });
    return images;
}

//create a string snippet in the format of and image tag for markdown
function createScreenShotCodeBlock(fileNames) {
    let imageTextBlock = '';
    shot = 1;
    fileNames.forEach(function(file) {
        file = file.replace(/ /g, "%20");
        imageTextBlock += ('*SCREEN SHOT ' + shot + '*');
        imageTextBlock += ('![screenshot](' + screenShotDir + '/' + file + ')');
        imageTextBlock += ('\n');

        shot++;
    });
    return imageTextBlock;

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
            choices: ['Apache License 2.0',
                'GNU General Public License v3.0',
                'MIT License',
                'BSD 2-Clause "Simplified" License',
                'BSD 3-Clause "New" or "Revised" License',
                'Boost Software License 1.0',
                'Creative Commons Zero v1.0 Universal',
                'Eclipse Public License 2.0',
                'GNU Affero General Public License v3.0',
                'GNU General Public License v2.0',
                'GNU Lesser General Public License v2.1',
                'Mozilla Public License 2.0',
                'The Unlicense'
            ]

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
        },
        {
            type: 'checkbox',
            name: 'screenshots',
            choices: screenShotFiles
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

[Application Screen Shots](#ScreenShots)...

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
NOTICE This application is covered under ${answers.license} license.
Please see license.md file for more information 

---
## Contribitors 

${answers.contrib}

---
## Tests
${answers.test}

---
## Questions

Github profile can be found here:  http://github.com/${username}

Please direct any additonal questions to: ${answers.questions}

---
## ScreenShots

${screenShotsText}



`
}



// initalize function for the script 
async function init() {

    try {
        // get username from CLI and query github for all the repos that belong to the user
        // get optional directory where screen shots could be stored
        console.log(chalk.yellow(figlet.textSync('GENERATE README', { horizontalLayout: 'default', width: 80, whitespaceBreak: true })));
        username = getUsername();
        screenShotDir = getDir();
        const repos = await getRepos(username);
        data = repos.data;


        // check if supplied screen shot directory exists. if so then return all the image file names in the directory 
        if (fs.existsSync(screenShotDir)) {
            screenShotFiles = checkForImageFiles(fs.readdirSync(screenShotDir));

        }

        // prompt user with the quesitons
        const answers = await askQuestions();
        // create the text block for appending images in markdown
        screenShotsText = createScreenShotCodeBlock(answers.screenshots);;


        // create a var for  readmefile from the user answers provided, now stored inthe array answers
        //  put some code here to deal with the license in the readme.
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