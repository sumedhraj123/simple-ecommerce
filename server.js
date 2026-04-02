const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const db = require("./db");

const app = express();

// Middleware
app.use(bodyParser.json());

// Serve static files (if you use /public later)
app.use(express.static(path.join(__dirname, "public")));

// ✅ Root route - serve your UI
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// ✅ Health check (for ALB)
app.get("/health", (req, res) => {
  res.status(200).send("healthy");
});

// ✅ Create order
app.post("/order", async (req, res) => {
  try {
    const { name, email, product } = req.body;

    if (!name || !email || !product) {
      return res.status(400).send({ error: "All fields are required" });
    }

    const result = await db.insertOrder({ name, email, product });
    res.send({ message: "Order saved!", result });

  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Failed to save order" });
  }
});

// ✅ Get orders
app.get("/orders", async (req, res) => {
  try {
    const orders = await db.getOrders();
    res.send(orders);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Failed to fetch orders" });
  }
});

// ✅ Use env port (best for Docker) OR fallback to 80
const PORT = process.env.PORT || 80;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
