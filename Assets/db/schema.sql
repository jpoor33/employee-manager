DROP DATABASE IF EXISTS company_db;
CREATE DATABASE company_db;

\c company_db; -- connect to the company db

-- create the departments table

CREATE TABLE departments (
    department_id SERIAL PRIMARY KEY,
    department_name VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    title VARCHAR(30) UNIQUE NOT NULL,
    salary DECIMAL NOT NULL,
    department INTEGER,
    FOREIGN KEY (department)
    REFERENCES departments(department_id)
    ON DELETE SET NULL
);

CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INTEGER NOT NULL, 
    FOREIGN KEY (role_id) REFERENCES roles(id),
    manager_id INTEGER, 
    FOREIGN KEY (manager_id) REFERENCES employees(id)
    ON DELETE SET NULL
);