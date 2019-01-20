# Shopify Internship Challenge

## Quick Links:
[Documentation](https://shehryarx.github.io/shopify-intern-challenge/)  
[Live server](https://shielded-waters-96177.herokuapp.com/graphql)

## Abstract
This is my submission for the Shopify Internship Challenge Summer '19.

Initially, I chose create a RESTful API using Node and Express. In the early stages of development, I realized how tedious the endpoints I created were. After looking up GraphQL, my perspective on API development completely pivoted! GraphQL is not only easy to implement, but even easier to use. Plus, I wanted to learn something new. For this reason, I chose to implement the API using GraphQL.

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
- Create shopping cart
- Add product to shopping cart
- Checkout shopping cart

## Documentation

Here's the documentation [link](https://shehryarx.github.io/shopify-intern-challenge/) to the server.

Below are some queries you will probably want to test. You can test them live on a Heroku server I deployed [right here](https://shielded-waters-96177.herokuapp.com/graphql).

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

```
mutation {
  checkoutShoppingCart(shoppingCartId){
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
