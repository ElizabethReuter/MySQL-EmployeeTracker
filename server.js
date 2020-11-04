// install dependencies
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
				connection.query("SELECT name, id AS value FROM department", function(err, data) {
					if (err) throw err;
					addNewRole(data);
				  });
				
            }
            else if ( response.doWhat === "Add Employee" ){
				connection.query("SELECT title AS name, id AS value FROM role", function(err, roleData) {
					if (err) throw err;
					connection.query("SELECT CONCAT(first_name,' ', last_name) AS name, id AS value FROM employee", function(err, empData) {
						if (err) throw err;
						empData.push({name:"none", value:null});
					addNewEmployee(roleData,empData);
					});
				});
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
				connection.query("SELECT title AS name, id AS value FROM role", function(err, roleData) {
					if (err) throw err;
				connection.query("SELECT CONCAT(first_name,' ', last_name) AS name, id AS value FROM employee", function(err, empData) {
						if (err) throw err;
					updateEmployeeRole(roleData,empData);
				});
				});
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
function addNewRole(departmentList){
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
function addNewEmployee(roleList,employeeList){

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
    var sql="SELECT department.name AS departmentName, role.title, role.salary FROM role";
    sql+=" INNER JOIN department";
    sql+=" ON (department.id=role.department_id)";
    sql+=" ORDER BY department.name, role.title"; 
    connection.query(sql, function(err, data) {
        if (err) {
            throw err;
        
        }
        console.table(data);
		init ();
        // console.log(data[0].RESULT);
      });
}

// Query search to view all employees
function viewEmployees(){
	var sql="SELECT CONCAT(emp1.first_name,' ', emp1.last_name) AS employee_name, role.title, CONCAT(mgr.first_name,' ', mgr.last_name) AS manager_name FROM employee emp1";
	sql+=" INNER JOIN role";
	sql+=" ON (role.id=emp1.role_id)";
	sql+=" LEFT OUTER JOIN employee mgr";
	sql+=" ON (mgr.id=emp1.manager_id)";
	sql+=" ORDER BY manager_name, employee_name";
    connection.query(sql, function(err, data) {
        if (err) throw err;
        console.table(data);
		init ();
      });

}

// update Employee Role 
function updateEmployeeRole(roleList, employeeList){
	inquirer.prompt([
		{
			type: "list",
			name: "employee_id",
			message: "Which employee would you like to update?",
			choices: employeeList
		},
		{
			type: "list",
			name: "role_id",
			message: "What is this employee's new role?",
			choices: roleList
		},
	])
	.then(function(updatedResult) {
		let data=[{role_id:updatedResult.role_id},{id:updatedResult.employee_id},];
		connection.query(
			'UPDATE employee SET ? WHERE ?',
			data,
			function(err,res) {
			  if (err) throw err;
			  console.log(res.affectedRows + "Your employee was updated!\n");
				init ();
			});
	});
}


init();