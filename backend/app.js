const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require('cors');
require("dotenv/config");

const app = express();

// middleware
app.use(cors());
app.options('*', cors());
app.use(express.json());
app.use(morgan("tiny"));

const api = process.env.API_URL;

// Routes
const productsRouter = require('./routes/products');
const categoriesRouter = require('./routes/categories');
const usersRouter = require('./routes/users');
const ordersRouter = require('./routes/orders');

// base endpoint path, JS file that contains CRUD logic and respective enpoint paths
app.use(`${api}/products`, productsRouter);
app.use(`${api}/categories`, categoriesRouter);
app.use(`${api}/users`, usersRouter);
app.use(`${api}/orders`, ordersRouter);

// Connecting to mongoDb
mongoose
  .connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database Connection is ready...");
  })
  .catch((err) => {
    console.log(err);
  });

// (port, callback function)
app.listen(3000, () => {
  console.log("server is running on http://localhost:3000/");
});
