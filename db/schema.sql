CREATE DATABASE employeeDb;

USE employeeDb;

CREATE TABLE department
( id                        INT           NOT NULL AUTO_INCREMENT,
  name                      VARCHAR(30)   NOT NULL,
  PRIMARY KEY (id)) ENGINE = InnoDB;

CREATE TABLE role
( id                        INT           NOT NULL AUTO_INCREMENT,
  title                     VARCHAR(30)   NOT NULL,
  salary                    DECIMAL       NOT NULL,
  department_id             INT           NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (department_id) REFERENCES department(id)
) ENGINE = InnoDB;

CREATE TABLE employee
( id                        INT           NOT NULL AUTO_INCREMENT,
  first_name                VARCHAR(30)   NOT NULL,
  last_name                 VARCHAR(30)   NOT NULL,
  role_id                   INT           NOT NULL,
  manager_id                INT           NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (role_id) REFERENCES role(id),
  FOREIGN KEY (manager_id) REFERENCES employee(id)
) ENGINE = InnoDB;


INSERT INTO department (id, name)
VALUES (NULL, 'Marketing');
INSERT INTO department (id, name)
VALUES (NULL, 'Sales');
INSERT INTO department (id, name)
VALUES (NULL, 'Accounting');

INSERT INTO role (id, title, salary, department_id)
VALUES (NULL, 'Market Jr', 50000, 1);
INSERT INTO role (id, title, salary, department_id)
VALUES (NULL, 'Sales Jr.', 60000, 2);
INSERT INTO role (id, title, salary, department_id)
VALUES (NULL, 'Acct Jr.', 70000, 3);

INSERT INTO role (id, title, salary, department_id)
VALUES (NULL, 'Market Sr', 70000, 1);
INSERT INTO role (id, title, salary, department_id)
VALUES (NULL, 'Sales Sr.', 80000, 2);
INSERT INTO role (id, title, salary, department_id)
VALUES (NULL, 'Acct Sr.', 90000, 3);

INSERT INTO role (id, title, salary, department_id)
VALUES (NULL, 'Market Manager', 100000, 1);
INSERT INTO role (id, title, salary, department_id)
VALUES (NULL, 'Sales Manager', 120000, 2);
INSERT INTO role (id, title, salary, department_id)
VALUES (NULL, 'Acct Manager.', 140000, 3);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (NULL, 'Bill', 'Gates', 9 , NULL);