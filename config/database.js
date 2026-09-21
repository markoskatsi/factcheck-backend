// Imports ---------------------------------
import mysql from "mysql2/promise";

// Database connection -------------------

const dbConfig = {
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT,
  namedPlaceholders: true
};

let database = null;

try {
  database = await mysql.createPool(dbConfig);
  console.log("Database connection created successfully.");
} catch (error) {
  console.log("Error creating database connection: " + error.message);
  process.exit();
}

export default database;
