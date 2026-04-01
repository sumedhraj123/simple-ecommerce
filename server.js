const express = require("express");
const bodyParser = require("body-parser");
const db = require("./db");

const app = express();
app.use(bodyParser.json());
app.use(express.static("public"));

app.post("/order", async (req, res) => {
  const { name, email, product } = req.body;
  const result = await db.insertOrder({ name, email, product });
  res.send({ message: "Order saved!", result });
});

app.get("/orders", async (req, res) => {
  const orders = await db.getOrders();
  res.send(orders);
});

app.listen(3000, () => console.log("Server running on port 3000"));
