const graphql = require("graphql");
const chai = require("chai");
const mongoose = require("mongoose");
const expect = chai.expect;

const Product = require("./models/Product");
const ShoppingCart = require("./models/ShoppingCart");

describe("Product Schema", () => {
  it("Should have title of type String", () => {
    let product = new Product();
    const { title } = product;
    expect(typeof title === "string");
  });

  it("Should have price of type number", () => {
    let product = new Product();
    const { price } = product;
    expect(typeof price === "number");
  });

  it("Should have inventoryCount of type number", () => {
    let product = new Product();
    const { inventoryCount } = product;
    expect(typeof inventoryCount === "number");
  });
});

describe("Shopping Cart Schema", () => {
  it("Should have numberOfItems of type number", () => {
    let shoppingCart = new ShoppingCart();
    const { numberOfItems } = shoppingCart;
    expect(typeof numberOfItems === "number");
  });

  it("Should have totalPrice of type number", () => {
    let shoppingCart = new ShoppingCart();
    const { totalPrice } = shoppingCart;
    expect(typeof totalPrice === "number");
  });

  it("Should have products of type array of numbers", () => {
    let shoppingCart = new ShoppingCart();
    const { products } = shoppingCart;
    expect(!products.some(isNaN));
  });
});

describe("Testing the database", function() {
  it("Connect to the database", () => {
    return mongoose.createConnection(
      "mongodb://shehryar:shopifyChallenge!1@ds151614.mlab.com:51614/shopify-challenge",
      { useNewUrlParser: true }
    );
  });
});
