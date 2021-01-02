const mysql = require("mysql");
const inquirer = require("inquirer");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "employee_tracker_db"
});

connection.connect(function (error) {
  if (error) throw error;
  start();
});

function start() {
    inquirer.prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: ["Add a Department", "Add a Role", "Add an Employee", "View All Departments", "View All Roles", "View All Employees", "Update Employee Role"]
    }).then(function (response) {
      switch (response.action) {
        case "Add a Department":
          addDepartment();
          break;
        case "Add a Role":
          addRole();
          break;
        case "Add an Employee":
          addEmployee();
          break;
        case "View All Departments":
          viewDepartment();
          break;
        case "View All Roles":
          viewRole();
          break;
        case "View All Employees":
          viewEmployee();
          break;
        case "Update Employee Role":
          updateEmployeeRole();
      }
    });
  };