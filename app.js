// bringing in package files to app
const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");

// setting up the connection to database
const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    // this is where your MySQL localhost password should be entered
    password: "password",
    database: "employee_tracker_db"
});

// connecting to database
connection.connect((error) => {
    if (error) throw error;
});

// global arrays that will hold table data from database
let roleArray = [];
let departmentArray = [];
let employeeArray = [];

// function to first clear out global arrays then fill them with current table data
const refreshData = async () => {
    try {
        connection.query("SELECT * FROM role", function (error, result) {
            if (error) throw error;
            roleArray = [];
            result.forEach(role => roleArray.push(role));
        });
        connection.query("SELECT * FROM department", function (error, result) {
            if (error) throw error;
            departmentArray = [];
            result.forEach(department => departmentArray.push(department));
        });
        connection.query("SELECT * FROM employee", function (error, result) {
            if (error) throw error;
            employeeArray = [];
            result.forEach(employee => employeeArray.push(employee));
        })
    }
    catch (error) {
        throw error;
    }
}

// directory function that prompts the user with all options
const start = async () => {
    try {
        await refreshData();
        await inquirer.prompt({
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: ["Add a Department", "Add a Role", "Add an Employee", "View All Departments", "View All Roles", "View All Employees", "Update Employee Role", "End Connection"]
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
                case "End Connection":
                    connection.end();
            };
        });
    }
    catch (error) {
        throw error;
    };
};

// function that takes a user input and adds that input into the department table
const addDepartment = async () => {
    try {
        await inquirer.prompt({
            name: "department",
            type: "input",
            message: "What is the name of the department you would like to add?"
        }).then(async (result) => {
            // inserting the user's response into the department table
            connection.query("INSERT INTO department SET ?", { "name": result.department }, function (error, result) {
                if (error) throw error;
                console.log("---- A Department Has Been Added! ----");
                start();
            });
        });
    }
    catch (error) {
        throw error
    };
};

// function that takes user inputs and adds the inputs into the role table
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
            // takes all the objects in the departmentArray and returns a new array with only their name
            choices: () => departmentArray.map((department) => { return department.name })
        }
        ]).then(async (responses) => {
            let depID;
            // cycles through the departmentArray to find the department the user selected and grabs that department's id
            const getDepID = async () => {
                departmentArray.forEach((department) => {
                    if (department.name === responses.departmentChoice) {
                        depID = parseInt(department.id)
                    };
                });
            };
            await getDepID();
            // taking all the responses the user gave and inserting them into the role table
            connection.query("INSERT INTO role SET ?", {
                "title": responses.title,
                "salary": responses.salary,
                "department_id": depID
            }, function (error, result) {
                if (error) throw error;
                console.log("---- A Role Has Been Added! ----");
                start();
            });
        });
    }
    catch (error) {
        throw error
    };
};

// function that takes user inputs and adds those inputs into the employee table
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
            // taking all the objects from the roleArray and returning a new array containing just the title strings
            choices: () => roleArray.map((role) => { return role.title })
        },
        {
            name: "manager",
            type: "list",
            message: "Who is this employee's manager?",
            // taking the objects in the employeeArray and returning a new array of strings containing the employees first and last name
            choices: () => employeeArray.map((employee) => { return (employee.first_name + " " + employee.last_name) })
        }]).then(async (responses) => {
            let roleID;
            // cycles through the roleArray to find the role the user selected and grabs that role's id
            const getRoleID = async () => {
                roleArray.forEach((role) => {
                    if (role.title === responses.role) {
                        roleID = parseInt(role.id);
                    };
                });
            };
            let managerID;
            // cycles through the employeeArray to find the employee the user selected and grabs that employee's id
            const getManagerID = async () => {
                employeeArray.forEach((employee) => {
                    if ((employee.first_name + " " + employee.last_name) === responses.manager) {
                        managerID = parseInt(employee.id);
                    };
                });
            };
            await getRoleID();
            await getManagerID();
            // taking the users inputs and inserting them into the employee table
            connection.query("INSERT INTO employee SET ?", {
                "first_name": responses.firstName,
                "last_name": responses.lastName,
                "role_id": roleID,
                "manager_id": managerID

            }, function (error, result) {
                if (error) throw error;
                console.log("---- An Employee Has Been Added! ----");
                start();
            });
        })
    }
    catch (error) {
        throw error
    };
};

// function that displays the department table with current data
const viewDepartment = async () => {
    try {
        connection.query("SELECT * FROM department", function (error, results) {
            if (error) throw error;
            console.table(results);
            start();
        })
    }
    catch (error) {
        throw error
    };
};

// function that displays the role table with current data
const viewRole = async () => {
    try {
        connection.query("SELECT * FROM role", function (error, results) {
            if (error) throw error;
            console.table(results);
            start();
        })
    }
    catch (error) {
        throw error
    };
};

// mysql query that will join the role table on the employee table where role ids match and will join the department table on that where the department ids match
let query = "SELECT employee.id AS 'ID', employee.first_name AS 'First Name', employee.last_name AS 'Last Name', role.title AS 'Title', department.name AS 'Department', role.salary AS 'Salary', employee.manager_id AS 'Manager_ID' "
query += "FROM employee "
query += "INNER JOIN role ON employee.role_id=role.id "
query += "INNER JOIN department ON role.department_id=department.id;"

// function that will display a single table with the data of 3 seperate tables joined
const viewEmployee = async () => {
    try {
        connection.query(query, function (error, results) {
            if (error) throw error;
            console.table(results);
            start();
        });
    }
    catch (error) {
        throw error;
    };
};

// function that will allow the user to select a current employee from the employee table and update their role
const updateEmployeeRole = async () => {
    try {
        inquirer.prompt([{
            name: "employees",
            type: "list",
            message: "Which Employee would you like to update?",
            choices: () => employeeArray.map((employee) => { return (employee.first_name + " " + employee.last_name) })
        },
        {
            name: "newRole",
            type: "list",
            message: "What is this employee's new role?",
            choices: () => roleArray.map((role) => { return role.title })
        }]).then(async (responses) => {
            let roleID;
            const getRoleID = async () => {
                roleArray.forEach((role) => {
                    if (role.title === responses.newRole) {
                        roleID = parseInt(role.id);
                    };
                });
            };
            let employeeID;
            const getEmployeeID = async () => {
                employeeArray.forEach((employee) => {
                    if ((employee.first_name + " " + employee.last_name) === responses.employees) {
                        employeeID = parseInt(employee.id);
                    };
                });
            };
            await getRoleID();
            await getEmployeeID();
            // finds an employee by id and changes their role_id 
            connection.query("UPDATE employee SET ? WHERE ?", [{ role_id: roleID }, { id: employeeID }], function (error, result) {
                if (error) throw error;
                console.log("---- An Employee Has Been Updated ----");
                start();
            });
        });
    }
    catch (error) {
        throw error;
    };
};

// main function that starts it all
const main = async () => {
    try {
        await start();
    }
    catch (error) {
        throw error;
    };
};

main();