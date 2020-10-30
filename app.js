const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "employee_trackerDB"
});

connection.connect(function (err) {
    if (err) throw err;
    runPrompt();
  });

  function runPrompt() {
    inquirer
    .prompt({
      type: "list",
      message: "What would you like to do?",
      name: "choice",
      choices: [
              "View All Employees", 
              "View all Emplyees by Deparment", 
              "View All Employees by Manager",
              "Add Employee",
              "Remove Employee",
              "Update Employee Role",
              "Add Role",
            ]
    })
    .then(function(val) {
      switch (val.choice) {
          case "View All Employees?":
            viewEmployees();
          break;
  
          case "View all Emplyees by Deparment":
            viewDepartments();
          break;

          case "View All Employees by Manager":
            viewManagers();
          break;
        
          case "Add Employee":
            addEmployee();
          break;

          case "Remove Employee":
            removeEmployee();
          break;
    
          case "Update Employee Role":
            updateRole();
          break;

          case "Add Role":
            addRole();
          break;
        
      }
    });

    function viewEmployees() {
      connection.query("SELECT employee.first_name, employee.last_name, role.title, role.salary, department.name, CONCAT(e.first_name, ' ' ,e.last_name) AS Manager FROM employee INNER JOIN role on role.id = employee.role_id INNER JOIN department on department.id = role.department_id left join employee e on employee.manager_id = e.id;", 
      function(err, res) {
        if (err) throw err
        console.table(res)
        runPrompt()
    })
  }

  function viewDepartments() {
    connection.query("SELECT employee.first_name, employee.last_name, department.name AS Department FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id ORDER BY employee.id;", 
    function(err, res) {
      if (err) throw err
      console.table(res)
      runPrompt()
    })
  }

  function viewManagers() {
    connection.query("SELECT employee.first_name, employee.last_name, manager.name AS Manager FROM employee JOIN role ON employee.role_id = role.id JOIN manager ON role.manager_id = manager.id ORDER BY employee.id;", 
    function(err, res) {
      if (err) throw err
      console.table(res)
      runPrompt()
    })
  }

// Add Employee
  var roleArr = [];
function selectRole() {
  connection.query("SELECT * FROM role", function(err, res) {
    if (err) throw err
    for (var i = 0; i < res.length; i++) {
      roleArr.push(res[i].title);
    }

  })
  return roleArr;
}
var managersArr = [];
function selectManager() {
  connection.query("SELECT first_name, last_name FROM employee WHERE manager_id IS NULL", function(err, res) {
    if (err) throw err
    for (var i = 0; i < res.length; i++) {
      managersArr.push(res[i].first_name);
    }

  })
  return managersArr;
}
function addEmployee() { 
    inquirer.prompt([
        {
          name: "firstname",
          type: "input",
          message: "Enter their first name "
        },
        {
          name: "lastname",
          type: "input",
          message: "Enter their last name "
        },
        {
          name: "role",
          type: "list",
          message: "What is their role? ",
          choices: selectRole()
        },
        {
            name: "choice",
            type: "rawlist",
            message: "Whats their managers name?",
            choices: selectManager()
        }
    ]).then(function (val) {
      var roleId = selectRole().indexOf(val.role) + 1
      var managerId = selectManager().indexOf(val.choice) + 1
      connection.query("INSERT INTO employee SET ?", 
      {
          first_name: val.firstName,
          last_name: val.lastName,
          manager_id: managerId,
          role_id: roleId
          
      }, function(err){
          if (err) throw err
          console.table(val)
          runPrompt()
      })

  })
}

// Remove Employee
function removeEmployee(){
  inquirer.prompt([
      {
          name: "firstName",
          type: "input",
          message: "Employees first name to be deleted?"
      },
      {
          name: "lastName",
          type: "input",
          message: "Employees last name to be deleted?"
      },
  ]).then(answers => {
      connection.query("DELETE FROM employee WHERE first_name = ? and last_name = ?", [answers.firstName, answers.lastName], function (err) {
      console.log(res);
      runPrompt();
  })

  });
}

// Update Employee Role
function updateRole() {
  connection.query("SELECT employee.last_name, role.title FROM employee JOIN role ON employee.role_id = role.id;", function(err, res) {
  // console.log(res)
   if (err) throw err
   console.log(res)
  inquirer.prompt([
        {
          name: "lastName",
          type: "rawlist",
          choices: function() {
            var lastName = [];
            for (var i = 0; i < res.length; i++) {
              lastName.push(res[i].last_name);
            }
            return lastName;
          },
          message: "What is the Employee's last name? ",
        },
        {
          name: "role",
          type: "rawlist",
          message: "What is the Employees new title? ",
          choices: selectRole()
        },
    ]).then(function(val) {
      var roleId = selectRole().indexOf(val.role) + 1
      connection.query("UPDATE employee SET WHERE ?", 
      {
        last_name: val.lastName
         
      }, 
      {
        role_id: roleId
         
      }, 
      function(err){
          if (err) throw err
          console.table(val)
          startPrompt()
      })

  });
});

}
// Add Role
function addRole() { 
  connection.query("SELECT role.title AS Title, role.salary AS Salary FROM role",   function(err, res) {
  inquirer.prompt([
      {
        name: "Title",
        type: "input",
        message: "What is the roles Title?"
      },
      {
        name: "Salary",
        type: "input",
        message: "What is the Salary?"

      } 
  ]).then(function(res) {
      connection.query(
          "INSERT INTO role SET ?",
          {
            title: res.Title,
            salary: res.Salary,
          },
          function(err) {
              if (err) throw err
              console.table(res);
              startPrompt();
          }
      )

  });
});
};