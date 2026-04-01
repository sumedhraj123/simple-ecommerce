const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const db = require("./db");

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// ✅ Root route (FIX for health check)
app.get("/", (req, res) => {
  res.send("OK"); // or serve HTML if you want
  // res.sendFile(path.join(__dirname, "index.html"));
});

// ✅ Optional health endpoint (best practice)
app.get("/health", (req, res) => {
  res.status(200).send("healthy");
});

// Existing routes
app.post("/order", async (req, res) => {
  try {
    const { name, email, product } = req.body;
    const result = await db.insertOrder({ name, email, product });
    res.send({ message: "Order saved!", result });
  } catch (err) {
    res.status(500).send({ error: "Failed to save order" });
  }
});

app.get("/orders", async (req, res) => {
  try {
    const orders = await db.getOrders();
    res.send(orders);
  } catch (err) {
    res.status(500).send({ error: "Failed to fetch orders" });
  }
});

// ✅ IMPORTANT: listen on port 80 for ALB
const PORT = 80;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
