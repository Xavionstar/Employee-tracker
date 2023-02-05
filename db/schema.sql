DROP DATABASE IF EXISTS employeetracker_db;
CREATE DATABASE employeetracker_db;

USE employeetracker_db;

CREATE TABLE department (
  id INT  AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(30) NOT NULL
);

CREATE TABLE job (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL,
  departmentID INT,
  FOREIGN KEY (departmentID)
  REFERENCES department(id)
  ON DELETE SET NULL
  );

CREATE TABLE employee (
    id INT AUTO_INCREMENT PRIMARY KEY,
    firstname VARCHAR(30) NOT NULL,
    lastname VARCHAR(30) NOT NULL,
    jobID INT,
    managerID INT,
    FOREIGN KEY (jobID)
        REFERENCES job (id)
        ON DELETE SET NULL,
    FOREIGN KEY (managerID)
        REFERENCES employee (id)
        ON DELETE SET NULL
);