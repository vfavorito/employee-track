const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");

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
        await refreshData();
        await inquirer.prompt({
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: ["Add a Department", "Add a Role", "Add an Employee", "View All Departments", "View All Roles", "View All Employees", "Update Employee Role"]
        }).then(async (response) => {
            switch (response.action) {
                case "Add a Department":
                    await addDepartment();
                    break;
                case "Add a Role":
                    await addRole();
                    break;
                case "Add an Employee":
                    await addEmployee();
                    break;
                case "View All Departments":
                    await viewDepartment();
                    break;
                case "View All Roles":
                    await viewRole();
                    break;
                case "View All Employees":
                    await viewEmployee();
                    break;
                case "Update Employee Role":
                    await updateEmployeeRole();
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
        }).then(async (result) => {
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
        ]).then(async (responses) => {
            let depID;
            const getDepID = async () => {
                departmentArray.forEach((department) => {
                    if (department.name === responses.departmentChoice) {
                        depID = parseInt(department.id)
                    };
                });
            };
            await getDepID();
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
const addEmployee = async () => {
    try {
        await inquirer.prompt([{
            name: "firstName",
            type: "input",
            message: "What is this employee's first name?"
        },
        {
            name: "lastName",
            type: "input",
            message: "What is the employee's last name?"
        },
        {
            name: "role",
            type: "list",
            message: "What role does this employee have?",
            choices: () => roleArray.map((role) => { return role.title })
        },
        {
            name: "manager",
            type: "list",
            message: "Who is this employee's manager?",
            choices: () => employeeArray.map((employee) => { return (employee.first_name + " " + employee.last_name) })
        }]).then(async (responses) => {
            let roleID;
            const getRoleID = async () => {
                roleArray.forEach((role) => {
                    if (role.title === responses.role) {
                        roleID = parseInt(role.id);
                    };
                });
            };
            let managerID;
            const getManagerID = async () => {
                employeeArray.forEach((employee) => {
                    if ((employee.first_name + " " + employee.last_name) === responses.manager) {
                        managerID = parseInt(employee.id);
                    };
                });
            };
            await getRoleID();
            await getManagerID();
            connection.query("INSERT INTO employee SET ?", {
                "first_name": responses.firstName,
                "last_name": responses.lastName,
                "role_id": roleID,
                "manager_id": managerID

            }, function (error, result) {
                if (error) throw error;
                console.log("Employee Added!");
            });
        })
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

let query = "SELECT employee.id AS 'ID', employee.first_name AS 'First Name', employee.last_name AS 'Last Name', role.title AS 'Title', department.name AS 'Department', role.salary AS 'Salary', employee.manager_id AS 'Manager_ID' " 
query += "FROM employee "
query += "INNER JOIN role ON employee.role_id=role.id "
query += "INNER JOIN department ON role.department_id=department.id;"

const viewEmployee = async () => {
    try {
        connection.query(query, function (error, results) {
            if (error) throw error;
            console.table(results);
        })
    }
    catch (error) {
        throw error;
    };
};

