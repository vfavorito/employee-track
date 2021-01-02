USE employee_tracker_db;

INSERT INTO department(name)
    VALUES("human resources");

INSERT INTO role(title,salary,department_id)
    VALUES("customer service manager",65000,1);

INSERT INTO role(title,salary,department_id)
    VALUES("customer service rep",45000,1);

INSERT INTO employee(first_name,last_name,role_id)
    VALUES("george","johnson",1);

INSERT INTO employee(first_name,last_name,role_id,manager_id)
    VALUES("sally","smith",2,1);
