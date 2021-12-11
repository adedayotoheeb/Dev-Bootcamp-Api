/*jshint esversion: 6 */
const nodegeocoder = require("node-geocoder");

const options = {
  provider: "mapquest",
  httpAdapter: "https",
  apiKey: "jhOZoazEZiYjUZ8n4GTWi773A6EdyGfq",
  formatter: null,
};

const geocoder = nodegeocoder(options);
module.exports = geocoder;
