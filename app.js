const mysql = require("mysql");
const inquirer = require("inquirer");

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "employee_tracker_db"
});

connection.connect((error) => {
    if (error) throw error;
    start();
});

let roleArray = [];
let departmentArray = [];
let employeeArray = [];

const refreshData = async () => {
    try {
        connection.query("SELECT * FROM role", function (error, result) {
            if (error) throw error;
            result.forEach(role => roleArray.push(role));
        });
        connection.query("SELECT * FROM department", function (error, result) {
            if (error) throw error;
            result.forEach(department => departmentArray.push(department));
        });
        connection.query("SELECT * FROM employee", function (error, result) {
            if (error) throw error;
            result.forEach(employee => employeeArray.push(employee));
        })
    }
    catch (error) {
        throw error;
    }
}

const start = async () => {
    try {
        await inquirer.prompt({
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: ["Add a Department", "Add a Role", "Add an Employee", "View All Departments", "View All Roles", "View All Employees", "Update Employee Role"]
        }).then((response) => {
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
            };
        });
    }
    catch (error) {
        throw error;
    };
};
const addDepartment = async () => {
    try {
        await inquirer.prompt({
            name: "department",
            type: "input",
            message: "What is the name of the department you would like to add?"
        }).then((result) => {
            connection.query("INSERT INTO department SET ?", { "name": result.department }, function (error, result) {
                if (error) throw error;
                console.log("Department Added!");
            });
        })
    }
    catch (error) {
        throw error
    }
};
const addRole = async () => {
    try {
        await inquirer.prompt([{
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
            choices: () => departmentArray.map((department) => { return department.name })
        }
        ]).then((responses) => {
            let depID;
            const getDepID = async () => {
                departmentArray.forEach((department) => {
                    if (department.name === responses.departmentChoice) {
                        depID = parseInt(department.id)
                    };
                });
            };
            await refreshData();
            await getdepID();
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
    catch (error) {
        throw error
    };
};

const viewDepartment = async () => {
    try {
        connection.query("SELECT * FROM department", function (error, results) {
            if (error) throw error;
            console.table(results);
        })
    }
    catch (error) {
        throw error
    };
};
const viewRole = async () => {
    try {
        connection.query("SELECT * FROM role", function (error, results) {
            if (error) throw error;
            console.table(results);
        })
    }
    catch (error) {
        throw error
    };
};

