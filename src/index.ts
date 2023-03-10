import express from "express";
import mysql from "mysql2/promise";
import parameterRoutes from "./routes/parameters";
import rigfamiliesRoutes from "./routes/rigfamilies";

const bodyParser = require("body-parser");

const app = express();

// Database connection pool
export const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "password",
  database: "parameter db",
});

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Routes
app.use("/parameters", parameterRoutes);
app.use("/rigfamilies", rigfamiliesRoutes);

// Start the server
app.listen(3000, () => {
  console.log("Server started on port 3000");
});
