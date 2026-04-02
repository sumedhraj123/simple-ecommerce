const mysql = require("mysql2/promise");

// Create connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Insert order
exports.insertOrder = async (data) => {
  const { name, email, product } = data;

  const query = `
    INSERT INTO orders (name, email, product)
    VALUES (?, ?, ?)
  `;

  const [result] = await pool.execute(query, [name, email, product]);
  return result;
};

// Get all orders
exports.getOrders = async () => {
  const [rows] = await pool.execute("SELECT * FROM orders");
  return rows;
};
