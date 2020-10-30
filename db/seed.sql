USE employee_trackerDB;

-- DEPARTMENT SEEDS -----
INSERT INTO department (name)
VALUE ("Engineering");
INSERT INTO department (name)
VALUE ("Sales");
INSERT INTO department (name)
VALUE ("Accounting");
INSERT INTO department (name)
VALUE ("Legal");

-- EMPLOYEE ROLE SEEDS -------
INSERT INTO role (title, salary, department_id)
VALUE ("Engineer", 100000, 1);
INSERT INTO role (title, salary, department_id)
VALUE ("Salesperson", 80000, 2);
INSERT INTO role (title, salary, department_id)
VALUE ("Accountant", 130000, 3);
INSERT INTO role (title, salary, department_id)
VALUE ("Lawyer", 150000, 4);

-- EMPLOYEE SEEDS -------
INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("Taylor", "Berry", null, 1);
INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("Alex", "Durkin", null, 2);
INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("Troy","Stratton",2,3);
INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("Megan", "Dean", 1, 4);
INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("Kristen", "Mardeusz", 3, 5);
INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("Lindsey", "Schaberg", 4, 6);

