import express from "express";
import mysql from "mysql2/promise";
import parameterRoutes from "./routes/parameters";
import rigfamiliesRoutes from "./routes/rigfamilies";
import unitsRoutes from "./routes/units";
import dotenv from "dotenv";
import path from "path";

const bodyParser = require("body-parser");

const app = express();

dotenv.config({ path: path.join(__dirname, "../.env") });

const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("../swagger.ts");

app.use("/", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// Database connection pool
export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
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
