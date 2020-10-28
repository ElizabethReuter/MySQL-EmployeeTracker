const mysql = require("mysql");
const inquirer = require("inquirer");


var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "employeesDB"
});

connection.connect(function (err) {
    if (err) throw err;
    runPrompt();
  });

  function runPrompt () {
      inquirer
        .prompt({

        })
        .then(function(answer) {
            switch (answer.action) {
            case "View Employees":
              viewEmployees();
              break;
            }
        });


  }