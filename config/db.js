/*jshint esversion: 6 */
/*jshint esversion: 8*/

// const connectDB = async () => {
//   const conn = mongoose.connect("mongodb://127.0.0.1:27017/devcamper", {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useFindAndModify: false,
//     useUnifiedTopology: true,
//   });
//   console.log(`MOngoDB Connected: ${conn.connection.host}`);
// };
const mongoose = require("mongoose");

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
