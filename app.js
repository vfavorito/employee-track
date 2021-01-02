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
function addDepartment() {
    inquirer.prompt({
        name: "department",
        type: "input",
        message: "What is the name of the department you would like to add?"
    }).then(function (result) {
        connection.query("INSERT INTO department SET ?", { "name": result.department }, function (error, result) {
            if (error) throw error;
            console.log("Department Added!");
        });
    });
};
function addRole() {
    connection.query("SELECT * FROM department", function (error, result) {
        if (error) throw error;
        inquirer.prompt([{
            name: "title",
            type: "input",
            message: "What is the title of the role you want to add?"
        },
        {
            name: "salary",
            type: "input",
            message: "What is the salary for this role?"
        },
        {
            name: "departmentChoice",
            type: "list",
            message: "What department does this role belong to?",
            choices: function () {
                const departmentArray = [];
                for (let i = 0; i < result.length; i++) {
                    departmentArray.push(result[i].name);
                }
                return departmentArray;
            }
        }
        ]).then(function (responses) {
            let depID;
            let getID = function () {
                result.forEach((department) => {
                    if (department.name === responses.departmentChoice) {
                        depID = parseInt(department.id)
                    };
                });
            };
            getID();
            connection.query("INSERT INTO role SET ?", {
                "title": responses.title,
                "salary": responses.salary,
                "department_id": depID
            }, function (error, result) {
                if (error) throw error;
                console.log("Role Added!");
            });
        });
    }
    )
};
function viewDepartment() {
    connection.query("SELECT * FROM department", function (error, results) {
        if (error) throw error;
        console.table(results);
    });
};
function viewRole() {
    connection.query("SELECT * FROM role", function (error, results) {
        if (error) throw error;
        console.table(results);
    });
};

let query = "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS 'Department', role.salary, employee.manager_id " 
query += "FROM employee "
query += "INNER JOIN role ON employee.role_id=role.id "
query += "INNER JOIN department ON role.department_id=department.id;"

function viewEmployee() {
    connection.query(query, function (error, results){
      if (error) throw error;
      console.table(results)
    });
  };