// install Dependencies  
const Department = require("./lib/Department");
const Role = require("./lib/Role");
const Employee = require("./lib/Employee");
const mysql = require("mysql")
const inquirer = require("inquirer");
const cTable = require("console.table");

// establish connection to mysql, and correct db 
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "employeeDb"
  }); 


connection.connect(function(err) {
    if (err) {
      console.error("error connecting: " + err.stack);
      return;
    }
    console.log("connected as id " + connection.threadId);
  });

  
function init() {
// prompt the user to tell the program what to do using inquirer then depending on what they choose run that fx
	inquirer
        .prompt([{
			type: "list",
			name: "doWhat",
			message: "What would you like to do",
			choices: ["Add Department", "Add Role", "Add Employee", "View Departments", "View Roles", "View Employees", "Update Employee Role"]
		}]).then(function(response) {
            if( response.doWhat === "Add Department" ){
				addNewDepartment();
			}
            else if ( response.doWhat === "Add Role" ){
				addNewRole();
            }
            else if ( response.doWhat === "Add Employee" ){
				addNewEmployee();
            }
            else if ( response.doWhat === "View Departments" ){
				viewDepartments();
            }
            else if ( response.doWhat === "View Roles" ){
				viewRoles();
            }
            else if ( response.doWhat === "View Employees" ){
				viewEmployees();
            }
            else if ( response.doWhat === "Update Employee Role" ){
				updateEmployeeRole();
            }
		});
}

// Adds new department 
function addNewDepartment(){
	inquirer.prompt([
		{
			type: "input",
			name: "name",
			message: "What is the department's name?"
		}
	])
	.then(function(departmentResult) {
		var newDepartment = new Department(departmentResult.name);
		connection.query(
			"INSERT INTO department SET ?",
			{
			  name: newDepartment.name,
			},
			function(err) {
			  if (err) throw err;
			  console.log("Your department was added!");
				init ();
			});
    });          
}

// Adds new role 
function addNewRole(){
	var departmentList = [{name: "Marketing", value: 1}, {name: "Sales", value: 2}, {name: "Accounting", value: 3}];

	inquirer.prompt([
		{
			type: "input",
			name: "title",
			message: "What is the role's title?"
		},
		{
			type: "input",
			name: "salary",
			message: "What is the role's salary?"
		},
		{
			type: "list",
			name: "department_id",
			message: "What is the role's department?",
			choices: departmentList
		}
	])
	.then(function(roleResult) {
		var newRole = new Role(roleResult.title, roleResult.salary, roleResult.department_id);
		connection.query(
			"INSERT INTO role SET ?",
			{
			  title: newRole.title,
			  salary: newRole.salary,
			  department_id: newRole.department_id,
			},
			function(err) {
			  if (err) throw err;
			  console.log("Your role was added!");
				init ();
			});
	});
}

// Adds new employee 
function addNewEmployee(){
	var roleList = [{name: "Marketing Person", value: 1}, {name: "Sales Person", value: 2}, , {name: "Accountant", value: 3} ];
	var employeeList = [{name: "None", value: null}];

	inquirer.prompt([
		{
			type: "input",
			name: "first_name",
			message: "What is the employee's first name?"
		},
		{
			type: "input",
			name: "last_name",
			message: "What is the employee's last name?"
		},
		{
			type: "list",
			name: "role_id",
			message: "What is the employee's role?",
			choices: roleList
		},
		{
			type: "list",
			name: "manager_id",
			message: "Who is the employee's manager?",
			choices: employeeList
		}
	])
	.then(function(employeeResult) {
		var newEmployee = new Employee(employeeResult.first_name, employeeResult.last_name, employeeResult.role_id, employeeResult.manager_id);
		console.log(newEmployee.manager_id);
		if (newEmployee.manager_id === null) {
			newEmployee.manager_id = 5;
		}
		console.log(newEmployee.manager_id);
		connection.query(
			"INSERT INTO employee SET ?",
			{
			  first_name: newEmployee.first_name,
			  last_name: newEmployee.last_name,
			  role_id: newEmployee.role_id,
			  manager_id: newEmployee.manager_id,
			},
			function(err) {
			  if (err) throw err;
			  console.log("Your employee was added!");
				init ();
			});
	});
}

// Query search to view all departments 
function viewDepartments(){
    connection.query("SELECT * FROM department", function(err, data) {
        if (err) throw err;
        console.table(data);
		init ();
      });

}

// Query search to view all roles using inner join from department table and role table. 
function viewRoles(){
    // variable that concatenates the inner join my sql command
    var sql="SELECT role.title, role.salary, department.name AS departmentName FROM role";
    sql+=" INNER JOIN department";
    sql+=" ON (department.id=role.department_id)";
    sql+=" ORDER BY department.name, role.title"; 
    connection.query(sql, function(err, data) {
        if (err) {
            throw err;
        }
		console.table(data);
		init ();
      });
}

// Query search to view all employees
function viewEmployees(){
    connection.query("SELECT * FROM employee", function(err, data) {
        if (err) throw err;
        console.table(data);
		init();
      });

}

// update Employee Role **still not able to figure out.
// function updateEmployeeRole(){
// 	var updateEmployee = new Employee(employeeResult.first_name, employeeResult.last_name, employeeResult.role_id, employeeResult.manager_id);
// 	connection.query(
// 		"UPDATE employee SET ?",
// 		[
// 		  {
// 			role_id: updateEmployee.role_id
// 		  },
// 		],
// 		function(error) {
// 		  if (error) throw err;
// 		  console.log("Employee was updated!");
// 		  init();
// 	});
// }

init();