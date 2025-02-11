-- Delete existing data
DELETE FROM employees;
DELETE FROM roles;
DELETE FROM departments;

-- Insert departments
INSERT INTO departments (department_name) VALUES 
('Engineering'),
('Sales'),
('Human Resources'),
('Finance');

-- Insert roles
INSERT INTO roles (title, salary, department) VALUES 
('Software Engineer', 90000, 1),
('Sales Manager', 85000, 2),
('HR Specialist', 70000, 3),
('Financial Analyst', 75000, 4),
('Engineering Manager', 120000, 1);

-- Insert managers
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES 
('Alice', 'Johnson', 5, NULL),
('Bob', 'Smith', 2, NULL);

-- Insert employees
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES 
('Charlie', 'Brown', 1, 1),
('David', 'Williams', 4, 2),
('Eve', 'Davis', 3, NULL);