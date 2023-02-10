import * as dotenv from 'dotenv'
dotenv.config();

import cTable from 'console.table';

import mysql2 from 'mysql2';
import inquirer from 'inquirer';


//This establishes the connection to the DB
const connection = mysql2.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    },
    console.log()
);
//This is the initial function that opens the connection to the database and runs the main function
connection.connect(function (err) {
    if (err) {
        return console.error('error: ' + err.message);
    }
    firstQuestions();
    
});

//These are the question loops that prompt the user
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

//This is the main method that has all of the sections of code that pull answers from and update the database
function firstQuestions() {
    return inquirer.prompt(initQuestions).then((answers) => {
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
              addDept(answers)
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
        else if (answers.initQuestions === "Quit") {
            connection.end(function(err) {
                if (err) {
                  return console.log('error:' + err.message);
                }
                console.log('Have a nice Day!');
              });

        }
    })

}


//This function shows the database table for departments
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

//This function shows the database table for jobs
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
//This function shows the database table for employees
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
//This function allows the user to add departments to the company
function addDept(answers) {

    let addDept = `INSERT INTO department (name) VALUES ("${answers.deptName}")`;
    connection.query(addDept, (error) => {
        if (error) {
            return console.error(error.message);
        }
        viewDept()
    })
}
//This function allows the user to add jobs to the company
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
//This function works in tandem with the addjob function to take in the answers from the user prompts and insert all of the matching table columns
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

//This function allows the user to add employees to the company
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

//This function is a more complex version of insertjob, it takes in results from user prompts and then works with addemployee to fill all of the columns
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
    })
}

//This function allows the user to make changes to existing employees
function updateEmployee() {
    let empNameData = `SELECT firstname, id FROM employee`;
    connection.query(empNameData, (error, eResults) => {
        if (error) {
            return console.error(error.message);
        }
        updateQuestions[0].choices = eResults.map(employee => employee.firstname);

        let jobTitleData = `SELECT title, id FROM job`;
        connection.query(jobTitleData, (error, jResults) => {
            if (error) {
                return console.error(error.message);
            }
            updateQuestions[1].choices = jResults.map(job => job.title);

            inquirer.prompt(updateQuestions).then((answers) => {
                updateEmpJob(answers, jResults)
            })
        })


    })
}

//This function works with updateEmployee function to fill in all of the employees new column data
function updateEmpJob(answers, jResults) {
    const jobID = jResults.find(result => result.title === answers.empUpdateJob).id
    let changeEmployee = `UPDATE employee SET jobID = "${jobID}" WHERE firstname = "${answers.empUpdateName}"`;
    connection.query(changeEmployee, (error) => {
        if (error) {
            return console.error(error.message);
        }
        viewEmployee()
    })
}