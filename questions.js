import inquirer from 'inquirer';
import fs from 'fs';
import mysql2 from 'mysql2';
// import cTable from 'cTable';




// export {firstQuestions};

const initQuestions = [

    {
        type: "rawlist",
        name: 'initQuestions',
        message: 'What would you like to do?',
        choices: ['View All Departments', 'View All Jobs', 'View All Employees', 'Add a Department', 'Add a Job', 'Add an Employee', 'Update an Employee', 'Quit']
    },
]
function firstQuestions() {
    return inquirer.prompt(initQuestions).then((answers) => {
        console.log(answers)
        if (answers.firstQuestions === "View All Departments") {
            inquirer.prompt().then(async (answers) => {
                let viewDept = `SELECT * FROM departments`;
                connection.query(viewDept, (error, results) => {
                  if (error) {
                    return console.error(error.message);
                  }
                  console.log(results);
                });
                
               
            }
            )
        }
        // else if (answers.initQuestions === "Intern") {
        //     inquirer.prompt(internQuestions).then(async (answers) => {
        //         console.log(answers)
        //        employeeChoice()
        //     })

        // }
    })
}