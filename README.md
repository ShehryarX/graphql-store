# Shopify Internship Challenge

## Quick Links:

[Github Repo](https://github.com/ShehryarX/shopify-intern-challenge)  
[Documentation](https://shehryarx.github.io/shopify-intern-challenge/) hosted from `docs/`  
[Live server](https://shielded-waters-96177.herokuapp.com/graphql) hosted on Heroku

To run the code locally:  
`git clone https://github.com/ShehryarX/shopify-intern-challenge`  
`cd server/`  
`npm install && npm start`

Navigate to `localhost:4000/graphql`.

## Abstract

This is my submission for the Shopify Internship Challenge Summer '19.

Initially, I chose create a RESTful API using Node and Express. In the early stages of development, I realized how tedious the endpoints I created were. After looking up GraphQL, my perspective on API development completely pivoted! GraphQL is not only easy to implement, but even easier to use. Plus, I wanted to learn something new. For this reason, I chose to implement the API using GraphQL. All the back-end is stored on MongoDB (mlab) through interfacing with mongoose.

## Stack

- GraphQL for all things server
- MongoDB for all database storage
- GraphiQL for API testing

## Overview

Let's understand the problem. We want to model the interaction between two objects: products and shopping carts. What we want to be able to do by the end of this is:

1. Add a product given a title, price, and inventory count
2. Create a shopping cart
3. Add products into the shopping cart
4. Checkout the shopping cart, which will in turn, update the inventory of the products

Note that we shouldn't be able to add a product that has 0 inventory relative to our cart. To explain this, let's say there's 2 apples for sale. I add both of them to my cart, and globally, there are still 2 apples until I checkout. What I need to look at to determine whether I can add another apple is its inventory relative to my cart.

## Object Analysis

There are two objects we'd like to model: `Product` and `ShoppingCart`. These two objects can interact as well.

To create a product, all we'll need is the name, price, and inventory of the product:

```
const ProductSchema = new Schema({
  title: String,
  price: Number,
  inventoryCount: Number
});
```

To create the shopping cart, we shouldn't need anything specific. Perhaps a user token or randomly generated number stored in local cache could work, but for our purposes, creating a cart shouldn't require any parameters. The shopping cart object itself should contain the number of items it has, a list of the product IDs, and the total price:

```
const ShoppingCartSchema = new Schema({
  numberOfItems: Number,
  totalPrice: Number,
  products: [{ Number }]
});
```

Note that what we could have done is refer to the product by any other paramater like user ID. In practicaility, you would probably have a JSON web token transfer. Due to this reason, I chose to model the shopping cart based on a randomly generated seed value. This would also enable users to create a shopping cart in local storage, without sigining up for the store itself.

## Queries

As of now, we can query information about:

- A specific product
- A specific shopping cart
- All products
- All available products (inventory >= 0)
- All shopping carts

## Mutations

We should be able to manipulate this data. Here are the methods I've implemented:

- Create product
  - Adds a new product given required parameters (see docs)
- Create shopping cart
- Add product to shopping cart
  - Updates the product list inside the ShoppingCart object
- Checkout shopping cart
  - Will ensure there are enough products to be checkout out
  - Will update product count upon successful purchase

## Adding Security

All parameters on the API protect against:

- Inputs of `null`
- Invalid MongoIDs

Depth limiting:
To prevent attacks where a hacker could provide deep queries, we prevent against access a very high depth. The current API will prevent against depths greater than 6. As you can imagine, having a very high depth means more time is devoted toward resolving that query. In all cases of our use, we wouldn't want to exceed a depth of 6.

This is reflected by the `app.js` file.

## Unit Testing

I've never done unit testing before, but I learned how using Medium. I read up on a few articles about using `mocha`, `chai`, and `expect` to develop a systematic way of testing the API. I quickly wrote up a few tests that check the Mongo models and ensure their properties are correct, as well as a database connection test.

In the future, I would add more unit tests to chekc the function of the API as well. You can find the tests in `test.js` inside the `server/` directory. You can run the tests by running `npm run test-server`.

It should give the following output:

```
Product Schema
    ✓ Should have title of type String
    ✓ Should have price of type number
    ✓ Should have inventoryCount of type number

  Shopping Cart Schema
    ✓ Should have numberOfItems of type number
    ✓ Should have totalPrice of type number
    ✓ Should have products of type array of numbers

  Testing the database
    ✓ Connect to the database (233ms)


  7 passing (254ms)
```

## Documentation

Here's the documentation [link](https://shehryarx.github.io/shopify-intern-challenge/) to the server.

Below are some queries you will probably want to test. You can test them live on a Heroku server I deployed [right here](https://shielded-waters-96177.herokuapp.com/graphql). Note this might take a few seconds to set up because the Heroku server probably needs to spin up again.

List all shopping carts:

```
{
  shoppingCarts {
    id
    numberOfItems
    totalPrice
    products {
      id
      title
      price
      inventoryCount
    }
  }
}
```

List all products:

```
{
  products {
    id
    title
    price
    inventoryCount
  }
}
```

List all available products (inventory available):

```
{
  availableProducts {
    id
    title
    price
    inventoryCount
  }
}
```

Create a product:

```
mutation {
  addProduct(title, price, inventoryCount) {
    id
    title
    price
    inventoryCount
  }
}
```

Delete a product:

```
mutation {
  deleteProduct(id){
    id
  }
}
```

Register a shopping cart:

```
mutation {
  addShoppingCart {
    id
    totalPrice
    numberOfItems
    products {
      id
      title
      price
      inventoryCount
    }
  }
}
```

Delete a shopping cart:

```
mutation {
  deleteProduct(id){
    id
  }
}
```

Add a product to a shopping cart:

```
mutation {
  addProductToShoppingCart(shoppingCartId, productId) {
    id
    totalPrice
    numberOfItems
    products {
      id
      title
      price
      inventoryCount
    }
  }
}
```

Checkout shopping cart:  
Note: Once you checkout, you will see the product inventory updated when you fetch all products.

```
mutation {
  checkoutShoppingCart(shoppingCartId) {
    id
    totalPrice
    numberOfItems
    products {
      id
      title
      price
      inventoryCount
    }
  }
}
```

## Reflection

Before I dive in to things I did, what I could have done differently and other cool stuff, I'll go over my experience coding this back-end. This was my first time using GraphQL, and I have to say that it was amazing! Some improvements I've noticed that GraphQL gets rid of is underfetching and overfetching. Users in the front-end simply request exactly what they need. It was really easy and quick to code the API. GraphQL enabled rapid prototype development and I've witnessed firsthand how fast it can be used to develop an API. Lastly, the docs and community are awesome! I don't think I'll go back to RESTful and CRUDful APIs soon, it's time to learn more about the power of GraphQL.

1. One thing I noticed during the challenge was the simplicity of using `await` and `async`. I would refactor the Promises into using `await` and `async` to create cleaner code.
2. I should learn more about unit testing because I usually end up testing the code myself
3. GraphQL is really cool and easy to interface with as compared to RESTful APIs
4. I also would've added authentication using JWTs and bycrypt.js
5. I would have added more unit testing functionality to account for the edge cases in my code
