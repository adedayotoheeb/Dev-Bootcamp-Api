/*jshint esversion: 6 */
/*jshint esversion: 8 */

const fs = require("fs");
const mongoose = require("mongoose");
const colors = require("colors");
const dotenv = require("dotenv");

// Load env vars
dotenv.config({ path: "./config/config.env" });

//Load models
const Bootcamp = require("./models/bootcamp");
const Course = require("./models/course");
const User = require("./models/user");

//Connect to the database
mongoose
  .connect("mongodb://127.0.0.1:27017/devcamper", {
    useNewUrlParser: true,
    // useCreateIndex: true,
    // useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to mongodb");
  })
  .catch((error) => {
    console.log("Couldnt connect to mongodb", error);
  });

// Read the JSON files

const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bootcamps.json`, "utf-8")
);

const courses = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/courses.json`, "utf-8")
);

const users = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/users.json`, "utf-8")
);

// import into db
const importData = async () => {
  try {
    await Bootcamp.create(bootcamps);
    await Course.create(courses);
    await User.create(users);
    console.log("Data Imported ......".green.inverse);
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

//Delete data
const deleteData = async () => {
  try {
    await Bootcamp.deleteMany();
    await Course.deleteMany();
    await User.deleteMany();
    console.log("Data Deleted ......".red.inverse);
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

if (process.argv[2] === "i") {
  importData();
} else if (process.argv[2] === "d") {
  deleteData();
}
// mongod.exe --dbpath=/Users/USER/mongodb-data
