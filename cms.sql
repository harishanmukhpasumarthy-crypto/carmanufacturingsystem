CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  email VARCHAR(100) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role VARCHAR(50) NOT NULL,
  phone_num VARCHAR,
  created_date DATETIME,
);
CREATE TABLE carmodel (
  model_id SERIAL PRIMARY KEY,
  model_name VARCHAR(100) NOT NULL,
  company VARCHAR(100) NOT NULL,
  price DECIMAL(12,2) NOT NULL CHECK (price > 0),
  engine_type VARCHAR(50) NOT NULL
);
CREATE TABLE part (
  part_id SERIAL PRIMARY KEY,
  part_name VARCHAR(100) NOT NULL,
  category VARCHAR(50) NOT NULL,
  cost DECIMAL(10,2) NOT NULL CHECK (cost > 0),
  quantity INTEGER NOT NULL CHECK (quantity >= 0)
);
CREATE TABLE supplier (
  supplier_id SERIAL PRIMARY KEY,
  supplier_name VARCHAR(100) NOT NULL,
  city VARCHAR(50) NOT NULL,
  contact VARCHAR(20) NOT NULL
);
CREATE TABLE factory (
  factory_id SERIAL PRIMARY KEY,
  location VARCHAR(100) NOT NULL,
  capacity INTEGER NOT NULL CHECK (capacity > 0)
);
CREATE TABLE employee (
  employee_id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  role VARCHAR(50) NOT NULL,
  factory_id INTEGER NOT NULL,
  FOREIGN KEY (factory_id) REFERENCES factory(factory_id) ON DELETE CASCADE
);
CREATE TABLE dealer (
  dealer_id SERIAL PRIMARY KEY,
  dealer_name VARCHAR(100) NOT NULL,
  city VARCHAR(50) NOT NULL,
  contact VARCHAR(20) NOT NULL
);
CREATE TABLE production_record (
  production_id SERIAL PRIMARY KEY,
  factory_id INTEGER NOT NULL,
  model_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  production_date DATE NOT NULL,
  FOREIGN KEY (factory_id) REFERENCES factory(factory_id) ON DELETE RESTRICT,
  FOREIGN KEY (model_id) REFERENCES carmodel(model_id) ON DELETE RESTRICT
);
CREATE TABLE sales (
  sale_id SERIAL PRIMARY KEY,
  dealer_id INTEGER NOT NULL,
  model_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  sale_date DATE NOT NULL,
  FOREIGN KEY (dealer_id) REFERENCES dealer(dealer_id) ON DELETE RESTRICT,
  FOREIGN KEY (model_id) REFERENCES carmodel(model_id) ON DELETE RESTRICT
);
CREATE TABLE part_supply (
  supply_id SERIAL PRIMARY KEY,
  supplier_id INTEGER NOT NULL,
  part_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  FOREIGN KEY (supplier_id) REFERENCES supplier(supplier_id) ON DELETE RESTRICT,
  FOREIGN KEY (part_id) REFERENCES part(part_id) ON DELETE RESTRICT
);
CREATE TABLE carmodel_parts (
  id SERIAL PRIMARY KEY,
  model_id INTEGER NOT NULL,
  part_id INTEGER NOT NULL,
  quantity_required INTEGER NOT NULL CHECK (quantity_required > 0),
  FOREIGN KEY (model_id) REFERENCES carmodel(model_id) ON DELETE CASCADE,
  FOREIGN KEY (part_id) REFERENCES part(part_id) ON DELETE CASCADE
);
INSERT INTO users (email, password, role, phone_num, created_date) VALUES
('admin@gmail.com', '$2b$10$FiYj9JeWAO2F0FZcU43vEOtnUCxcG8RPTIs0c/n0RFnnSTSO4qvfi', 'admin', '9038383883', '2026-04-09');
