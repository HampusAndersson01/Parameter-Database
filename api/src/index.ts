import express from "express";
import mysql from "mysql2/promise";
import parameterRoutes from "./routes/parameters";
import rigfamiliesRoutes from "./routes/rigfamilies";
import unitsRoutes from "./routes/units";
import dotenv from "dotenv";
import path from "path";

const bodyParser = require("body-parser");

const app = express();

dotenv.config();

const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("../swagger.ts");

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// Database connection pool
export const pool = mysql.createPool({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
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
app.use("/units", unitsRoutes);

// Start the server
app.listen(3000, () => {
  console.log("Server started on port 3000");
});
