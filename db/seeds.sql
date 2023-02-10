INSERT INTO department (name)
VALUES ("Dungeoneering"),
       ("Ranging"),
       ("Arcana"),
       ("Swordplay"),
       ("Subterfuge");

INSERT INTO job (salary, title, departmentID)
VALUES (100000, "Fighter", 1),
        (110000, "Wizard", 2),
        (120000, "Rogue", 3),
        (130000, "Paladin", 4),
        (140000, "Barbarian", 5),
        (5000, "Team Leader", 2),
        (5000, "Guild Master", 1);

INSERT INTO employee (firstname, lastname, jobID, managerID)
VALUES ("Bruce", "Wayne", 1, 7),
        ("Clark", "Kent", 2, 8),
        ("Barry", "Allen", 3, 7),
        ("Diana", "Prince", 4, 8),
        ("Tony", "Stark", 5, 8),
        ("Steven", "Rogers", 1, 7),
        ("Clint", "Barton", 6, NULL),
        ("Scott", "Summers", 7, NULL);