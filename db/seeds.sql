INSERT INTO department (name)
VALUES ("HR"),
       ("Accounting"),
       ("Maintenance"),
       ("IT"),
       ("Customer Service");

INSERT INTO job (salary, title, departmentID)
VALUES (100000, "Human Resources", 1),
        (110000, "Accountant", 2),
        (120000, "Engineer", 3),
        (130000, "Programmer", 4),
        (140000, "Customer Relations Specialist", 5),
        (5000, "Team Manager", 2),
        (5000, "General Manager", 1);

INSERT INTO employee (firstname, lastname, jobID, managerID)
VALUES ("Bruce", "Wayne", 1, 7),
        ("Clark", "Kent", 2, 8),
        ("Barry", "Allen", 3, 7),
        ("Diana", "Prince", 4, 8),
        ("Tony", "Stark", 5, 8),
        ("Steven", "Rogers", 1, 7),
        ("Clint", "Barton", 6, NULL),
        ("Scott", "Summers", 7, NULL);