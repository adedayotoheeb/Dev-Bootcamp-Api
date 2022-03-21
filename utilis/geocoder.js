/*jshint esversion: 6 */
const nodegeocoder = require("node-geocoder");
const dotenv = require('dotenv')
dotenv.config({path:'./config/config.env'})
const options = {
  provider: "mapquest",
  httpAdapter: "https",
  apiKey: process.env.GEO_CODE_API_KEY ,
  formatter: null,
};

const geocoder = nodegeocoder(options);
module.exports = geocoder;



