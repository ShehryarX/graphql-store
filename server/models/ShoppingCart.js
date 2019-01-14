const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ShoppingCartSchema = new Schema({
  numberOfItems: Number,
  totalPrice: Number,
  products: [{ Number }]
});

module.exports = mongoose.model("ShoppingCart", ShoppingCartSchema);
