// Imports ---------------------------------
import mysql from "mysql2/promise";

// Database connection -------------------

const dbConfig = {
  host: process.env.MYSQLHOST || "localhost",
  user: process.env.MYSQLUSER || "root",
  password: process.env.MYSQLPASSWORD || "",
  database: process.env.MYSQLDATABASE || "factcheck",
  port: process.env.MYSQLPORT || 3306,
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
