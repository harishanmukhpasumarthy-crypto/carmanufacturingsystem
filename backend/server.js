import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import pool from "./config/db.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();





const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());


const SECRET = process.env.JWT_SECRET;

// Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query("SELECT * FROM users WHERE email=$1", [
      email,
    ]);

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = result.rows[0];


    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.user_id, role: user.role }, SECRET, {
      expiresIn: "1d",
    });

    res.json({ token, role: user.role });
  } catch (err) {
  console.error("LOGIN ERROR FULL:", err);
  res.status(500).json({ error: err.message });
}
  
});

// auth middleware
const auth = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) return res.status(403).json("No token");

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json("Invalid token");
  }
};

app.get("/", (req, res) => {
  res.send("Server running");
});
// Dashboard page routesd

app.get("/dashboard", auth, async (req, res) => {
  try {
    const cars = await pool.query("SELECT COUNT(*) FROM carmodel");
    const factories = await pool.query("SELECT COUNT(*) FROM factory");
    const employees = await pool.query("SELECT COUNT(*) FROM employee");
    const sales = await pool.query("SELECT COUNT(*) FROM sales");
    const users = await pool.query("SELECT COUNT(*) FROM users");

    res.json({
      cars: Number(cars.rows[0].count),
      factories: Number(factories.rows[0].count),
      employees: Number(employees.rows[0].count),
      sales: Number(sales.rows[0].count),
      users: Number(users.rows[0].count),
    });
  } catch (err) {
    console.log("DASHBOARD ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});
// cars page routes

app.get("/cars", auth, async (req, res) => {
  const result = await pool.query("SELECT * FROM carmodel ORDER BY model_id");
  res.json(result.rows);
});

app.post("/cars", auth, async (req, res) => {
  const { model_name, company, price, engine_type } = req.body;

  await pool.query(
    "INSERT INTO carmodel (model_name, company, price, engine_type) VALUES ($1,$2,$3,$4)",
    [model_name, company, price, engine_type],
  );

  res.json({ message: "Car added" });
});

app.put("/cars/:id", auth, async (req, res) => {
  const { id } = req.params;
  const { model_name, company, price, engine_type } = req.body;

  await pool.query(
    "UPDATE carmodel SET model_name=$1, company=$2, price=$3, engine_type=$4 WHERE model_id=$5",
    [model_name, company, price, engine_type, id],
  );

  res.json({ message: "Car updated" });
});

app.delete("/cars/:id", auth, async (req, res) => {
  const { id } = req.params;

  await pool.query("DELETE FROM carmodel WHERE model_id=$1", [id]);

  res.json({ message: "Car deleted" });
});

// parts page routes

app.get("/parts", auth, async (req, res) => {
  const result = await pool.query("SELECT * FROM part ORDER BY part_id");
  res.json(result.rows);
});

app.post("/parts", auth, async (req, res) => {
  const { part_name, category, cost, quantity } = req.body;

  await pool.query(
    "INSERT INTO part (part_name, category, cost, quantity) VALUES ($1,$2,$3,$4)",
    [part_name, category, cost, quantity],
  );

  res.json({ message: "Part added" });
});

app.put("/parts/:id", auth, async (req, res) => {
  const { id } = req.params;
  const { part_name, category, cost, quantity } = req.body;

  await pool.query(
    "UPDATE part SET part_name=$1, category=$2, cost=$3, quantity=$4 WHERE part_id=$5",
    [part_name, category, cost, quantity, id],
  );

  res.json({ message: "Part updated" });
});

app.delete("/parts/:id", auth, async (req, res) => {
  const { id } = req.params;

  await pool.query("DELETE FROM part WHERE part_id=$1", [id]);

  res.json({ message: "Part deleted" });
});

// Assign parts page routes

app.get("/assign", auth, async (req, res) => {
  const result = await pool.query(`
    SELECT cp.id, c.model_name, p.part_name, cp.quantity_required
    FROM carmodel_parts cp
    JOIN carmodel c ON cp.model_id = c.model_id
    JOIN part p ON cp.part_id = p.part_id
    ORDER BY cp.id
  `);

  res.json(result.rows);
});

app.post("/assign", async (req, res) => {
  const { model_id, part_id, quantity_required } = req.body;

  try {
    const stock = await pool.query(
      // quantoty validation
      "SELECT quantity FROM part WHERE part_id=$1",
      [part_id],
    );

    if (stock.rows.length === 0) {
      return res.status(404).json("Part not found");
    }

    if (quantity_required > stock.rows[0].quantity) {
      return res.status(400).json("Not enough stock");
    }

    await pool.query(
      "INSERT INTO carmodel_parts (model_id, part_id, quantity_required) VALUES ($1,$2,$3)",
      [model_id, part_id, quantity_required],
    );

    res.json({ message: "Assigned successfully" });
  } catch (err) {
    res.status(500).json(err.message);
  }
});

app.delete("/assign/:id", auth, async (req, res) => {
  const { id } = req.params;

  await pool.query("DELETE FROM carmodel_parts WHERE id=$1", [id]);

  res.json({ message: "Removed" });
});

// Suppliers page routes

// GET ALL SUPPLIERS
app.get("/suppliers", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM supplier ORDER BY supplier_id",
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// ADD SUPPLIER
app.post("/suppliers", async (req, res) => {
  const { supplier_name, city, contact } = req.body;

  try {
    await pool.query(
      "INSERT INTO supplier (supplier_name, city, contact) VALUES ($1,$2,$3)",
      [supplier_name, city, contact],
    );

    res.json({ message: "Supplier added" });
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// DELETE SUPPLIER
app.delete("/suppliers/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM supplier WHERE supplier_id=$1", [id]);

    res.json({ message: "Supplier deleted" });
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// UPDATE SUPPLIER
app.put("/suppliers/:id", async (req, res) => {
  const { id } = req.params;
  const { supplier_name, city, contact } = req.body;

  try {
    await pool.query(
      "UPDATE supplier SET supplier_name=$1, city=$2, contact=$3 WHERE supplier_id=$4",
      [supplier_name, city, contact, id],
    );

    res.json({ message: "Supplier updated" });
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// supply recors page routes

// GET ALL SUPPLY RECORDS
app.get("/part-supply", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        ps.supply_id,
        ps.supplier_id,
        ps.part_id,
        s.supplier_name,
        p.part_name,
        ps.quantity
      FROM part_supply ps
      JOIN supplier s ON ps.supplier_id = s.supplier_id
      JOIN part p ON ps.part_id = p.part_id
      ORDER BY ps.supply_id
    `);

    res.json(result.rows);
  } catch (err) {
    console.log("SUPPLY FETCH ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});


// ADD SUPPLY RECORD
app.post("/part-supply", async (req, res) => {
  try {
    let { supplier_id, part_id, quantity } = req.body;

    supplier_id = Number(supplier_id);
    part_id = Number(part_id);
    quantity = Number(quantity);

    if (!supplier_id || !part_id || !quantity) {
      return res.status(400).json({ error: "All fields required" });
    }

    // check supplier
    const sCheck = await pool.query(
      "SELECT * FROM supplier WHERE supplier_id=$1",
      [supplier_id],
    );

    if (sCheck.rows.length === 0) {
      return res.status(400).json({ error: "Invalid supplier_id" });
    }

    // check part
    const pCheck = await pool.query(
      "SELECT quantity FROM part WHERE part_id=$1",
      [part_id],
    );

    if (pCheck.rows.length === 0) {
      return res.status(400).json({ error: "Invalid part_id" });
    }
    if (quantity > pCheck.rows[0].quantity) {
      return res.status(400).json({ error: "Not enough stock available" });
    }

    const result = await pool.query(
      `INSERT INTO part_supply (supplier_id, part_id, quantity)
       VALUES ($1,$2,$3)
       RETURNING *`,
      [supplier_id, part_id, quantity],
    );

    res.status(201).json({
      message: "Supply record added",
      data: result.rows[0],
    });
  } catch (err) {
    console.log("SUPPLY CREATE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});


//FACTORY ROUTES--------------------------------------->

// insert
app.post("/factories", async (req, res) => {
  try {
    const { location, capacity } = req.body;

    if (!location || !capacity) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (isNaN(capacity) || Number(capacity) <= 0) {
      return res
        .status(400)
        .json({ error: "Capacity must be a positive number" });
    }

    const result = await pool.query(
      `INSERT INTO factory (location, capacity)
       VALUES ($1,$2)
       RETURNING *`,
      [location, Number(capacity)],
    );

    res.status(201).json({
      message: "Factory data added",
      data: result.rows[0],
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

// read all
app.get("/factories", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM factory ORDER BY factory_id`,
    );

    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// update
app.put("/factories/:id", async (req, res) => {
  try {
    const { location, capacity } = req.body;
    const { id } = req.params;

    if (!location || !capacity) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (isNaN(capacity) || Number(capacity) <= 0) {
      return res
        .status(400)
        .json({ error: "Capacity must be a positive number" });
    }

    const result = await pool.query(
      `UPDATE factory
       SET location=$1, capacity=$2
       WHERE factory_id=$3
       RETURNING *`,
      [location, Number(capacity), id],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Factory not found" });
    }

    res.status(200).json({
      message: "Factory updated",
      data: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// delete
app.delete("/factories/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM factory WHERE factory_id=$1 RETURNING *",
      [id],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Factory not found" });
    }

    res.status(200).json({
      message: "Factory deleted successfully",
      data: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
//EMPLOYESS

// CREATE
app.post("/employees", async (req, res) => {
  try {
    const { name, role, factory_id } = req.body;

    if (!name || !role || !factory_id) {
      return res.status(400).json({ error: "All fields required" });
    }

    if (isNaN(factory_id)) {
      return res.status(400).json({ error: "factory_id must be a number" });
    }

    // FK VALIDATION
    const factoryCheck = await pool.query(
      "SELECT * FROM factory WHERE factory_id = $1",
      [factory_id],
    );

    if (factoryCheck.rows.length === 0) {
      return res.status(400).json({ error: "Invalid factory_id" });
    }

    const result = await pool.query(
      `INSERT INTO employee (name, role, factory_id)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [name.trim(), role.trim(), Number(factory_id)],
    );

    res.status(201).json({
      message: "Employee added successfully",
      data: result.rows[0],
    });
  } catch (err) {
    console.log("EMPLOYEE CREATE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// READ ALL (JOIN with factory)
app.get("/employees", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
          e.employee_id,
          e.name,
          e.role,
          e.factory_id,
          f.location AS factory_location
       FROM employee e
       JOIN factory f ON e.factory_id = f.factory_id
       ORDER BY e.employee_id`,
    );

    res.status(200).json(result.rows);
  } catch (err) {
    console.log("EMPLOYEE FETCH ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// UPDATE
app.put("/employees/:id", async (req, res) => {
  try {
    const { name, role, factory_id } = req.body;
    const { id } = req.params;

    if (!name || !role || !factory_id) {
      return res.status(400).json({ error: "All fields required" });
    }

    if (isNaN(factory_id)) {
      return res.status(400).json({ error: "factory_id must be a number" });
    }

    // FK VALIDATION
    const factoryCheck = await pool.query(
      "SELECT * FROM factory WHERE factory_id = $1",
      [factory_id],
    );

    if (factoryCheck.rows.length === 0) {
      return res.status(400).json({ error: "Invalid factory_id" });
    }

    const result = await pool.query(
      `UPDATE employee
       SET name=$1, role=$2, factory_id=$3
       WHERE employee_id=$4
       RETURNING *`,
      [name.trim(), role.trim(), Number(factory_id), id],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Employee not found" });
    }

    res.status(200).json({
      message: "Employee updated successfully",
      data: result.rows[0],
    });
  } catch (err) {
    console.log("EMPLOYEE UPDATE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE
app.delete("/employees/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM employee WHERE employee_id=$1 RETURNING *",
      [id],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Employee not found" });
    }

    res.status(200).json({
      message: "Employee deleted successfully",
      data: result.rows[0],
    });
  } catch (err) {
    console.log("EMPLOYEE DELETE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// DEALERS

// CREATE
app.post("/dealers", async (req, res) => {
  try {
    const { dealer_name, city, contact } = req.body;

    if (!dealer_name || !city || !contact) {
      return res.status(400).json({ error: "All fields required" });
    }

    const result = await pool.query(
      `INSERT INTO dealer (dealer_name, city, contact)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [dealer_name.trim(), city.trim(), contact.trim()],
    );

    res.status(201).json({
      message: "Dealer added successfully",
      data: result.rows[0],
    });
  } catch (err) {
    console.log("DEALER CREATE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// READ ALL
app.get("/dealers", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM dealer ORDER BY dealer_id");

    res.status(200).json(result.rows);
  } catch (err) {
    console.log("DEALER FETCH ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// UPDATE
app.put("/dealers/:id", async (req, res) => {
  try {
    const { dealer_name, city, contact } = req.body;
    const { id } = req.params;

    if (!dealer_name || !city || !contact) {
      return res.status(400).json({ error: "All fields required" });
    }

    const result = await pool.query(
      `UPDATE dealer
       SET dealer_name=$1, city=$2, contact=$3
       WHERE dealer_id=$4
       RETURNING *`,
      [dealer_name.trim(), city.trim(), contact.trim(), id],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Dealer not found" });
    }

    res.status(200).json({
      message: "Dealer updated successfully",
      data: result.rows[0],
    });
  } catch (err) {
    console.log("DEALER UPDATE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE
app.delete("/dealers/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM dealer WHERE dealer_id=$1 RETURNING *",
      [id],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Dealer not found" });
    }

    res.status(200).json({
      message: "Dealer deleted successfully",
      data: result.rows[0],
    });
  } catch (err) {
    console.log("DEALER DELETE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// PRODUCTION

// CREATE
app.post("/production", async (req, res) => {
  try {
    let { factory_id, model_id, quantity, production_date } = req.body;

    // convert types (VERY IMPORTANT)
    factory_id = Number(factory_id);
    model_id = Number(model_id);
    quantity = Number(quantity);

    // validation
    if (!factory_id || !model_id || !quantity || !production_date) {
      return res.status(400).json({ error: "All fields required" });
    }

    // check factory
    const factoryCheck = await pool.query(
      "SELECT capacity FROM factory WHERE factory_id = $1",
      [factory_id],
    );

    if (factoryCheck.rows.length === 0) {
      return res.status(400).json({ error: "Invalid factory_id" });
    }

    // check model
    const modelCheck = await pool.query(
      "SELECT model_id FROM carmodel WHERE model_id = $1",
      [model_id],
    );

    if (modelCheck.rows.length === 0) {
      return res.status(400).json({ error: "Invalid model_id" });
    }

    // capacity check
    const capacity = factoryCheck.rows[0].capacity;

    if (quantity > capacity) {
      return res.status(400).json({
        error: `Production exceeds factory capacity (${capacity})`,
      });
    }

    // insert
    const result = await pool.query(
      `INSERT INTO production_record 
       (factory_id, model_id, quantity, production_date)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [factory_id, model_id, quantity, production_date],
    );

    res.status(201).json({
      message: "Production record added",
      data: result.rows[0],
    });
  } catch (err) {
    console.log("PRODUCTION CREATE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// READ ALL (JOIN)
app.get("/production", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
          pr.production_id,
          pr.factory_id,
          pr.model_id,
          f.location AS factory_location,
          cm.model_name,
          pr.quantity,
          pr.production_date
       FROM production_record pr
       JOIN factory f ON pr.factory_id = f.factory_id
       JOIN carmodel cm ON pr.model_id = cm.model_id
       ORDER BY pr.production_id`,
    );

    res.status(200).json(result.rows);
  } catch (err) {
    console.log("PRODUCTION FETCH ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});
// SALES

// CREATE
app.post("/sales", async (req, res) => {
  try {
    let { dealer_id, model_id, quantity, sale_date } = req.body;

    dealer_id = Number(dealer_id);
    model_id = Number(model_id);
    quantity = Number(quantity);

    // validation
    if (!dealer_id || !model_id || !quantity || !sale_date) {
      return res.status(400).json({ error: "All fields required" });
    }

    // check dealer
    const dealerCheck = await pool.query(
      "SELECT dealer_id FROM dealer WHERE dealer_id = $1",
      [dealer_id],
    );

    if (dealerCheck.rows.length === 0) {
      return res.status(400).json({ error: "Invalid dealer_id" });
    }

    // check model
    const modelCheck = await pool.query(
      "SELECT model_id FROM carmodel WHERE model_id = $1",
      [model_id],
    );

    if (modelCheck.rows.length === 0) {
      return res.status(400).json({ error: "Invalid model_id" });
    }

    // insert
    const result = await pool.query(
      `INSERT INTO sales (dealer_id, model_id, quantity, sale_date)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [dealer_id, model_id, quantity, sale_date],
    );

    res.status(201).json({
      message: "Sales record added",
      data: result.rows[0],
    });
  } catch (err) {
    console.log("SALES CREATE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// READ ALL (JOIN)
app.get("/sales", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
          s.sale_id,
          s.dealer_id,
          s.model_id,
          d.dealer_name,
          cm.model_name,
          s.quantity,
          s.sale_date
       FROM sales s
       JOIN dealer d ON s.dealer_id = d.dealer_id
       JOIN carmodel cm ON s.model_id = cm.model_id
       ORDER BY s.sale_id`,
    );

    res.status(200).json(result.rows);
  } catch (err) {
    console.log("SALES FETCH ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// USERS

// GET ALL USERS
app.get("/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users ORDER BY user_id");

    res.status(200).json(result.rows);
  } catch (err) {
    console.error("USERS FETCH ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// CREATE USER
app.post("/users", async (req, res) => {
  try {
    let { email, password, role, phone_num, created_date } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ error: "Email, password, role required" });
    }

    email = email.trim();
    password = password.trim();
    role = role.trim();
    const hashedPassword = await bcrypt.hash(password, 10);

    const dateValue = created_date === "" ? null : created_date;

    const result = await pool.query(
      `INSERT INTO users (email, password, role, phone_num, created_date)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [email, hashedPassword, role, phone_num, dateValue]
    );

    res.status(201).json({
      message: "User created successfully",
      data: result.rows[0],
    });

  } catch (err) {
    if (err.code === "23505") {
      return res.status(400).json({ error: "Email already exists" });
    }

    res.status(500).json({ error: "Server error" });
  }
});
// UPDATE USER
app.put("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    let { email, password, role, phone_num, created_date } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ error: "Email, password, role required" });
    }

    // clean input
    email = email.trim();
    password = password.trim();
    role = role.trim();

    const result = await pool.query(
      `UPDATE users
       SET email=$1,
           password=$2,
           role=$3,
           phone_num=$4,
           created_date=$5
       WHERE user_id=$6
       RETURNING *`,
      [email, password, role, phone_num, created_date, id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      message: "User updated successfully",
      data: result.rows[0],
    });
  } catch (err) {
    console.error("USER UPDATE ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE USER
app.delete("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM users WHERE user_id=$1 RETURNING *",
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      message: "User deleted successfully",
      data: result.rows[0],
    });
  } catch (err) {
    console.error("USER DELETE ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});