// get external npm packages
const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");

// assign port
const PORT = process.env.PORT || 8080;

// get internal modules
const db = require("./models"); // database models
const routes = require('./routes'); // api & html routes

const app = express();

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));
app.use('/', routes);

// access database
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/fitnessDB", { useNewUrlParser: true, useUnifiedTopology: true });


// listen on port
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});