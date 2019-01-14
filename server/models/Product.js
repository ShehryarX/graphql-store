const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  title: String,
  price: Number,
  inventoryCount: Number
});

module.exports = mongoose.model("Product", ProductSchema);
