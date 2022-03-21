/*jshint esversion: 6 */
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const connectDB = require("./config/db");
const colors = require("colors");
const errorHandler = require("./middleware/error");
const fileUpload = require("express-fileupload");
const path = require("path");
const cors = require('cors')
const mongoSanitize = require('express-mongo-sanitize')
const helmet = require('helmet')
const xssClean = require('xss-clean')
//Route files
const bootcampsRoute = require("./routes/bootcamp");
const coursesRoute = require("./routes/courses");
const authRoute = require("./routes/auth");
const cookieParser = require("cookie-parser");
const usersRoute = require("./routes/users");

//Laod en vars
dotenv.config({ path: "./config/config.env" });

const app = express();
// Body parser
app.use(express.json());

app.use(cors())
// Connect to database
// Cookie parser
app.use(cookieParser());
// Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(xssClean())
// File Uploading
app.use(
  fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
  })
);
// Sanitize data
app.use(mongoSanitize())

//
app.use(helmet())
// Mount router
app.use("/api/v1/bootcamps", bootcampsRoute);
app.use("/api/v1/courses", coursesRoute);
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/users", usersRoute);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(
  PORT,
  console.log(`Sever ruining on ${process.env.NODE_ENV} mode on port ${PORT}`)
);

// mongod.exe --dbpath=/Users/USER/mongodb-data
