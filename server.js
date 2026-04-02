const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const db = require("./db");

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (optional)
app.use(express.static(path.join(__dirname, "public")));

// ✅ Root route - serve UI
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// ✅ Health check (for ALB)
app.get("/health", (req, res) => {
  res.status(200).send("healthy");
});

// ✅ Create order (FIXED & IMPROVED)
app.post("/order", async (req, res) => {
  try {
    console.log("Incoming request:", req.body);

    const { name, email, product } = req.body;

    if (!name || !email || !product) {
      return res.status(400).json({ error: "All fields are required" });
    }

    await db.insertOrder({ name, email, product });

    res.status(200).json({ message: "Order placed successfully" });

  } catch (err) {
    console.error("DB ERROR:", err);
    res.status(500).json({ error: "Failed to save order" });
  }
});

// ✅ Get all orders
app.get("/orders", async (req, res) => {
  try {
    const orders = await db.getOrders();
    res.status(200).json(orders);
  } catch (err) {
    console.error("FETCH ERROR:", err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// ✅ Port config (Docker friendly)
const PORT = process.env.PORT || 80;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
