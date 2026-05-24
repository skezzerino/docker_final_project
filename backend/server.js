const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const app = express();

app.use(express.json());
app.use(cors());

const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "crm_db",
  password: process.env.DB_PASSWORD || "password",
  port: process.env.DB_PORT || 5432,
});

// Healthcheck для Docker
app.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy" });
});

app.get("/api/clients", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM clients");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

app.post("/api/clients", async (req, res) => {
  const { name, email, phone, company } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO clients (name, email, phone, company) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, email, phone, company],
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

const PORT = process.env.BACKEND_PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
