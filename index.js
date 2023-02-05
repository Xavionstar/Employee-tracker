import cTable from 'console.table';
import mysql2 from 'mysql2';
import inquirer from 'inquirer';
import fs from 'fs';
// import {firstQuestions} from './questions.js';

const connection = mysql2.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'Scottsummers1!',
        database: 'employeetracker_db'
    },
    console.log()
);

connection.connect(function (err) {
    if (err) {
        return console.error('error: ' + err.message);
    }
    firstQuestions()
    console.log();
});


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
        if (answers.initQuestions === "View All Departments") {
            viewDept()
        }
        else if (answers.initQuestions === "View All Jobs") {
            viewJobs()
        }
        else if (answers.initQuestions === "View All Employees") {
            viewEmployee()
        }
    })
}



function viewDept() {
    let viewDept = `SELECT * FROM department`;
    connection.query(viewDept, (error, results) => {
        if (error) {
            return console.error(error.message);
        }
        console.table(results);
        firstQuestions()
    });
}


function viewJobs() {
    let viewJobs = `SELECT * FROM job`;
    connection.query(viewJobs, (error, results) => {
        if (error) {
            return console.error(error.message);
        }
        console.table(results);
        firstQuestions()
    })
}

function viewEmployee(){
    let viewEmployee = `SELECT e.id, e.firstname, e.lastname, job.title, department.name AS "dept name", job.salary, m.firstname AS manager FROM employee e ` +
     ` JOIN job ON e.jobID = job.id` + 
     ` JOIN department ON job.departmentID = department.id` +
     ` LEFT OUTER JOIN employee AS m ON e.managerID = m.id`;
    connection.query(viewEmployee, (error, results) => {
        if (error) {
            return console.error(error.message);
        }
        console.table(results);
        firstQuestions()
    });
}