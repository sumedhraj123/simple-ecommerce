const { MongoClient } = require("mongodb");

const url = "mongodb://db:27017";
const client = new MongoClient(url);
const dbName = "ecommerce";

async function connect() {
  await client.connect();
  return client.db(dbName);
}

exports.insertOrder = async (data) => {
  const db = await connect();
  return db.collection("orders").insertOne(data);
};

exports.getOrders = async () => {
  const db = await connect();
  return db.collection("orders").find().toArray();
};
