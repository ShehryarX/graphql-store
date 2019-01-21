const graphql = require("graphql");
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLFloat,
  GraphQLInt,
  GraphQLID,
  GraphQLNonNull
} = graphql;

const { ProductType, ShoppingCartType } = require("../types/types");
const Product = require("../../models/Product");
const ShoppingCart = require("../../models/ShoppingCart");

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addProduct: {
      description:
        "Adds new product products collection and returns added product upon success",
      type: ProductType,
      args: {
        title: { type: GraphQLNonNull(GraphQLString), description: "Title" },
        price: {
          type: GraphQLNonNull(GraphQLFloat),
          description: "Price in CAD"
        },
        inventoryCount: {
          type: GraphQLNonNull(GraphQLInt),
          description: "Current inventory count"
        }
      },
      resolve(parent, args) {
        const { title, price, inventoryCount } = args;

        // create product
        let product = new Product({
          title,
          price,
          inventoryCount
        });

        // save to database
        return product.save();
      }
    },
    deleteProduct: {
      description: "Deletes product and returns null upon success",
      type: ProductType,
      args: {
        id: {
          type: GraphQLID,
          description: "The GraphQLID of a product"
        }
      },
      resolve(parent, args) {
        const { id } = args;

        Product.findById(id)
          .then(product => {
            if (product) {
              return product.delete();
            } else {
              return "Can't find product";
            }
          })
          .catch(err => "Can't find Product");
      }
    },
    addShoppingCart: {
      description:
        "Creates new shopping cart to shopping carts collection and returns added shopping cart upon success",
      type: ShoppingCartType,
      args: {},
      resolve(parent, args) {
        let shoppingCart = new ShoppingCart({
          numberOfItems: 0,
          totalPrice: 0,
          products: []
        });
        return shoppingCart.save();
      }
    },
    deleteShoppingCart: {
      description: "Deletes shopping cart and returns null upon success",
      type: ProductType,
      args: {
        id: {
          type: GraphQLID,
          description: "The GraphQLID of a shopping cart"
        }
      },
      resolve(parent, args) {
        const { id } = args;

        ShoppingCart.findById(id)
          .then(shoppingCart => {
            if (shoppingCart) {
              return shoppingCart.delete();
            } else {
              return "Can't find shopping cart";
            }
          })
          .catch(err => "Can't find shopping cart");
      }
    },
    addProductToShoppingCart: {
      description:
        "Adds product to shopping cart and returns updated shopping cart",
      type: ShoppingCartType,
      args: {
        productId: {
          type: GraphQLNonNull(GraphQLID),
          description: "The GraphQLID of the product"
        },
        shoppingCartId: {
          type: GraphQLNonNull(GraphQLID),
          description: "The GraphQLID of the shopping cart"
        }
      },
      resolve(parent, args) {
        const { productId, shoppingCartId } = args;
        return new Promise((resolve, reject) => {
          // find product
          Product.findById(productId)
            .then(product => {
              if (product) {
                // find shopping cart
                ShoppingCart.findById(shoppingCartId).then(shoppingCart => {
                  let deductions = 0;

                  // count how many products are in cart
                  for (let i = 0; i < shoppingCart.products.length; i++) {
                    if (shoppingCart.products[i].id === productId) ++deductions;
                  }

                  // make sure we can check out all products
                  if (product.inventoryCount - deductions <= 0) {
                    return reject("Product inventory has ran out");
                  }

                  if (shoppingCart) {
                    // update shopping cart parameters
                    shoppingCart.numberOfItems++;
                    shoppingCart.totalPrice += product.price;
                    shoppingCart.products.push(productId);

                    const {
                      numberOfItems,
                      totalPrice,
                      products
                    } = shoppingCart;

                    // save to database
                    shoppingCart
                      .update({
                        numberOfItems,
                        totalPrice,
                        products
                      })
                      .then(res => resolve(shoppingCart));
                    return resolve(shoppingCart);
                  } else {
                    return reject("Shopping cart not found");
                  }
                });
              } else {
                return reject("Product not found");
              }
            })
            .catch(() => reject("ID not found"));
        });
      }
    },
    checkoutShoppingCart: {
      description:
        "Proceeds to checkout items in shopping cart and returns updated shopping cart upon success",
      type: ShoppingCartType,
      args: {
        shoppingCartId: {
          type: GraphQLNonNull(GraphQLID),
          description: "The GraphQLID of a shopping cart"
        }
      },
      resolve(parent, args) {
        const { shoppingCartId } = args;

        return new Promise((resolve, reject) => {
          // find shopping cart
          ShoppingCart.findById(shoppingCartId)
            .then(shoppingCart => {
              if (shoppingCart) {
                let promises = [];
                let productInfo = {};

                // track frequency of each product in shopping cart
                shoppingCart.products.forEach(productId => {
                  const { _id } = productId;
                  if (!productInfo[_id]) {
                    productInfo[_id] = 0;
                  }
                  productInfo[_id]++;
                });

                let keys = Object.keys(productInfo);

                // ensure we can checkout each item
                for (let i = 0; i < keys.length; i++) {
                  let key = keys[i];
                  let count = productInfo[key];

                  // create a promise to remove a piece of inventory
                  promises.push(
                    Product.findById(key).then(product => {
                      const { inventoryCount } = product;
                      if (inventoryCount >= count) {
                        product
                          .update({
                            inventoryCount: inventoryCount - count
                          })
                          .then(() => console.log("Removed inventory"));
                      }
                    })
                  );
                }

                // wait for promise to finish
                Promise.all(promises).then(() => {
                  // create empty shopping cart
                  shoppingCart.numberOfItems = 0;
                  shoppingCart.totalPrice = 0;
                  shoppingCart.products = [];

                  // save to database
                  shoppingCart
                    .update({
                      numberOfItems: 0,
                      totalPrice: 0,
                      products: []
                    })
                    .then(res => resolve(shoppingCart));
                });
              } else {
                return reject("Shopping cart not found");
              }
            })
            .catch(() => reject("ID not found"));
        });
      }
    }
  }
});

module.exports = Mutation;
