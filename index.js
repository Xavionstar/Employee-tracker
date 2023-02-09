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
const deptQuestions = [
    {
        type: "input",
        name: "deptName",
        message: "What is the name of the deparment?"
    },
]


const jobQuestions = [
    {
        type: "input",
        name: "jobAddName",
        message: "What is the name of the job?"
    },
    {
        type: "input",
        name: "jobAddSalary",
        message: "What is the salary for this job?"
    },
    {
        type: "list",
        name: "jobAddDept",
        message: "What is the department for this job",
        choices: []
    },
]

const employeeQuestions = [
    {
        type: "input",
        name: "addEmpFirstName",
        message: "What is the Employee's first name?"
    },
    {
        type: "input",
        name: "addEmpLastName",
        message: "What is the Employee's last name?"
    },

    {
        type: "list",
        name: "addEmpJob",
        message: "What is the Employee's job?",
        choices: []
    },

    {
        type: "list",
        name: "addEmpManager",
        message: "What is the Employee's Manager?",
        choices: []
    },
]

const updateQuestions = [
    {
        type: "list",
        name: "empUpdateName",
        message: "What is the name of the employee you wish to update?",
        choices: []
    },
    {
        type: "list",
        name: "empUpdateJob",
        message: "What is the employee's new job?",
        choices: []
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
        else if (answers.initQuestions === "Add a Department") {
            inquirer.prompt(deptQuestions).then((answers) => {
                console.log(answers)
                addDept(answers)
                viewDept()
            })
        }
        else if (answers.initQuestions === "Add a Job") {
            addJob(answers)

        }
        else if (answers.initQuestions === "Add an Employee") {
            addEmployee(answers)

        }
        else if (answers.initQuestions === "Update an Employee") {
            updateEmployee(answers)

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

function viewEmployee() {
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

function addDept(answers) {

    let addDept = `INSERT INTO department (name) VALUES ("${answers.deptName}")`;
    connection.query(addDept, (error) => {
        if (error) {
            return console.error(error.message);
        }
        viewDept()
    })
}

function insertJob(answers, results) {
    let departmentID = results.find(result => result.name = answers.jobAddDept).id
    let addJob = `INSERT INTO job (salary, title, departmentID ) VALUES ("${answers.jobAddSalary}", "${answers.jobAddName}", "${departmentID}")`;
    connection.query(addJob, (error) => {
        if (error) {
            return console.error(error.message);
        }
        viewJobs()
    })
}

function addJob() {
    let addDeptChoices = `SELECT * FROM department`;
    connection.query(addDeptChoices, (error, results) => {
        if (error) {
            return console.error(error.message);
        }

        jobQuestions[2].choices = results.map(department => department.name);
        inquirer.prompt(jobQuestions).then((answers) => {
            insertJob(answers, results)
        })
    })
}

function insertEmployee(answers, empResults, jobResults) {
    let jobID = jobResults.find(result => result.title === answers.addEmpJob).id
    let mgrID = empResults.find(result => result.firstname === answers.addEmpManager).id
    let addEmployee = `INSERT INTO employee (firstname, lastname, jobID, managerID) VALUES ("${answers.addEmpFirstName}", "${answers.addEmpLastName}", "${jobID}", "${mgrID}")`;
    connection.query(addEmployee, (error) => {
        if (error) {
            return console.error(error.message);
        }
        viewEmployee()
    })
}

function addEmployee() {
    let jobTitleData = `SELECT title, id FROM job`;
    connection.query(jobTitleData, (error, jobResults) => {
        if (error) {
            return console.error(error.message);
        }
        employeeQuestions[2].choices = jobResults.map(job => job.title);

        let empNameData = `SELECT firstname , id FROM employee`;
        connection.query(empNameData, (error, empResults) => {
            if (error) {
                return console.error(error.message);

            }
            employeeQuestions[3].choices = empResults.map(employee => employee.firstname);

            inquirer.prompt(employeeQuestions).then((answers) => {
                insertEmployee(answers, empResults, jobResults)
            })
            
        })






        //
    })
}

function updateEmployee() {
    let empNameData = `SELECT firstname, id FROM employee`;
    connection.query(empNameData, (error, results) => {
        if (error) {
            return console.error(error.message);
        }
        updateQuestions[0].choices = results.map(employee => employee.firstname);

        inquirer.prompt(updateQuestions).then((answers) => {
            insertEmployee(answers,results)
        })
})
}