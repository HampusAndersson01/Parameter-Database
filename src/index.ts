import express from 'express';
import mysql from 'mysql2/promise';
import parameterRoutes from './routes/parameter';
import unitsRoutes from './routes/units';
import imageRoutes from './routes/image';
import sensorRoutes from './routes/sensor';

const bodyParser = require('body-parser');

const app = express();

// Database connection pool
export const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'parameter db'
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/parameters', parameterRoutes);
app.use('/units', unitsRoutes);
app.use('/images', imageRoutes);
app.use('/sensors', sensorRoutes);

// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});
