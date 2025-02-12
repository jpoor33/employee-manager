import { pool, connectToDb } from './connection.js';
import inquirer from 'inquirer';
await connectToDb();
//Request to get all department names and department ids
async function viewDepartments() {
    const sql = `SELECT department_name, department_id FROM departments`;
    const { rows } = await pool.query(sql);
    console.table(rows);
    mainMenu();
}
;
// Request to get the job title, role id, the department that role belongs to, and the salary for that role 
async function viewRoles() {
    const sql = `SELECT title, id, salary, departments.department_name 
               FROM roles
               JOIN departments ON department = departments.department_id`;
    const { rows } = await pool.query(sql);
    console.table(rows);
    mainMenu();
}
;
//Request to get all employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
async function viewEmployees() {
    const sql = `SELECT employees.id, employees.first_name, employees.last_name, roles.title, roles.salary, departments.department_name, manager_id  
               FROM employees
               JOIN roles ON employees.role_id = roles.id
               JOIN departments ON roles.department = departments.department_id`;
    const { rows } = await pool.query(sql);
    console.table(rows);
    mainMenu();
}
;
//Request to add a department (will require a department name)
async function addDepartment() {
    const { department_name } = await inquirer.prompt([
        {
            type: 'input',
            name: 'department_name',
            message: 'Enter the new department name:',
        }
    ]);
    const sql = `INSERT INTO departments (department_name) VALUES ($1) RETURNING *`;
    const { rows } = await pool.query(sql, [department_name]);
    console.log('Department added successfully:', rows[0]);
    mainMenu();
}
;
//Request to add a role (will require name, salary, and department for the role)
async function addRole() {
    const { title, salary, department } = await inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: 'Enter the role title:',
        },
        {
            type: 'input',
            name: 'salary',
            message: 'Enter the salary for the role:',
        },
        {
            type: 'input',
            name: 'department',
            message: 'Enter the department ID for the role:',
        }
    ]);
    const sql = `INSERT INTO roles (title, salary, department) VALUES ($1, $2, $3) RETURNING *`;
    const { rows } = await pool.query(sql, [title, salary, department]);
    console.log('Role added successfully:', rows[0]);
    mainMenu();
}
;
//Request to add a manager
async function addManager() {
    const { manager_first_name, manager_last_name, manager_role } = await inquirer.prompt([
        {
            type: 'input',
            name: 'manager_first_name',
            message: 'Enter the manager\'s first name:',
        },
        {
            type: 'input',
            name: 'manager_last_name',
            message: 'Enter the manager\'s last name:',
        },
        {
            type: 'input',
            name: 'manager_role',
            message: 'Enter the manager\'s role ID:',
        }
    ]);
    // Check if the manager's role exists in the roles table
    const roleCheckSql = `SELECT id FROM roles WHERE id = $1`;
    const { rows: roleRows } = await pool.query(roleCheckSql, [manager_role]);
    if (roleRows.length === 0) {
        console.log('Invalid role ID for the manager. Please enter a valid role ID.');
        return mainMenu(); // Or handle the error as needed
    }
    // Insert the new manager
    const managerSql = `INSERT INTO employees (first_name, last_name, role_id) 
                      VALUES ($1, $2, $3) RETURNING id`;
    const { rows: managerRows } = await pool.query(managerSql, [manager_first_name, manager_last_name, manager_role]);
    const managerId = managerRows[0].id; // Get the newly created manager ID
    console.log('Manager added successfully with ID:', managerId);
    return managerId; // Return the manager ID for use in adding an employee
}
//Requst to add an employee (will require the employee’s first name, last name, role, and manager)
async function addEmployee() {
    const managerId = await addManager(); // First add the manager to guaruntee an employee has a manager Null if not
    const { first_name, last_name, role } = await inquirer.prompt([
        {
            type: 'input',
            name: 'first_name',
            message: 'Enter the employee\'s first name:',
        },
        {
            type: 'input',
            name: 'last_name',
            message: 'Enter the employee\'s last name:',
        },
        {
            type: 'input',
            name: 'role',
            message: 'Enter the employee\'s role ID:',
        },
        {
            type: 'input',
            name: 'manager_id',
            message: 'Enter the manager\'s ID:',
        }
    ]);
    // Check if the role exists in the roles table
    const roleCheckSql = `SELECT id FROM roles WHERE id = $1`;
    const { rows: roleRows } = await pool.query(roleCheckSql, [role]);
    if (roleRows.length === 0) {
        console.log('Invalid role ID. Please enter a valid role ID.');
        return mainMenu(); // Or handle the error as needed
    }
    // Insert the new employee with the manager ID
    const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id) 
               VALUES ($1, $2, $3, $4) RETURNING *`;
    const { rows } = await pool.query(sql, [first_name, last_name, role, managerId]);
    console.log('Employee added successfully:', rows[0]);
    mainMenu();
}
;
//Request to update an employee's role
async function updateEmployeeRole() {
    const { employee_id, new_role_id } = await inquirer.prompt([
        {
            type: 'input',
            name: 'employee_id',
            message: "Enter the employee's ID:",
        },
        {
            type: 'input',
            name: 'new_role_id',
            message: "Enter the new role ID:",
        }
    ]);
    const sql = `UPDATE employees SET role_id = $1 WHERE id = $2 RETURNING *`;
    const { rows } = await pool.query(sql, [new_role_id, employee_id]);
    console.log('Employee role updated successfully:', rows[0]);
    mainMenu();
}
//Main menu function to allow user to navigate between choices 
async function mainMenu() {
    const { choices } = await inquirer.prompt([
        {
            type: 'list',
            name: 'choices',
            message: 'What would you like to do?',
            choices: [
                'View all departments',
                'View all roles',
                'View all employees',
                'Add a manager',
                'Add a department',
                'Add a role',
                'Add an employee',
                'Update an employee role',
                'Exit'
            ]
        }
    ]);
    //adding switch method to allow the user to switch between choices in the main menu
    switch (choices) {
        case 'View all departments':
            await viewDepartments();
            break;
        case 'View all roles':
            await viewRoles();
            break;
        case 'View all employees':
            await viewEmployees();
            break;
        case 'Add a manager':
            await addManager();
            break;
        case 'Add a department':
            await addDepartment();
            break;
        case 'Add a role':
            await addRole();
            break;
        case 'Add an employee':
            await addEmployee();
            break;
        case 'Update an employee role':
            await updateEmployeeRole();
            break;
        case 'Exit':
            console.log("Goodbye!");
            process.exit();
    }
}
// Start the CLI
mainMenu();
