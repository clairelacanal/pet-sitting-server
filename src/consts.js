require("dotenv").config();

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/pet-sittig";

const PORT = process.env.PORT || 3000;

const TOKEN_SECRET = process.env.TOKEN_SECRET;

module.exports = { MONGO_URI, PORT, TOKEN_SECRET };