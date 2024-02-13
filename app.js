const path = require("path");
const dotenv = require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger_output.json");

const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/post");
const userRoutes = require("./routes/user");

const app = express();
const port = process.env.PORT || 8080;

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET, POST, PUT, PATCH, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/", authRoutes);
app.use("/", userRoutes);
app.use("/", postRoutes);

app.use("/images", express.static(path.join(__dirname, "images")));

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect(process.env.DATABASE)
  .then((result) => {
    if (process.env.NODE_ENV === "production") {
      console.log("App listening in production on port", port);
    } else {
      console.log("App listening locally on port", port);
    }
    app.listen(port);
  })
  .catch((err) => console.log(err));
