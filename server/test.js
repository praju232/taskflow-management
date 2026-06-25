require("dotenv").config();

const { MongoClient } = require("mongodb");

const uri = process.env.MONGO_URI;

console.log("URI:", uri);
async function main() {
  try {
    const client = new MongoClient(uri);
    await client.connect();
    console.log("✅ Native MongoDB Driver Connected");
    await client.close();
  } catch (err) {
    console.error(err);
  }
}

main();