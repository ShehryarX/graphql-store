const graphql = require("graphql");
const { GraphQLObjectType, GraphQLID, GraphQLList } = graphql;
const { ProductType, ShoppingCartType } = require("../types/types");

const ShoppingCart = require("../../models/ShoppingCart");
const Product = require("../../models/Product");

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    product: {
      description: "Returns Product object",
      type: ProductType,
      args: {
        id: {
          type: GraphQLID,
          description: "The GraphQLID of a product"
        }
      },
      resolve(parent, args) {
        const { id } = args;

        // find and return product
        return Product.findById(id);
      }
    },
    shoppingCart: {
      type: ShoppingCartType,
      description: "Returns ShoppingCart object",
      args: {
        id: {
          type: GraphQLID,
          description: "The GraphQLID of a shopping cart"
        }
      },
      resolve(parent, args) {
        const { id } = args;

        // find and return shopping cart
        return ShoppingCart.findById(id);
      }
    },
    products: {
      description: "Returns list of all products",
      type: new GraphQLList(ProductType),
      resolve(parent, args) {
        return Product.find();
      }
    },
    availableProducts: {
      description: "Returns list of all available products",
      type: new GraphQLList(ProductType),
      resolve(parent, args) {
        // find and return products with inventory count greater than 0
        return Product.find()
          .where("inventoryCount")
          .gt(0);
      }
    },
    shoppingCarts: {
      description: "Returns list of all shopping carts (admin feature)",
      type: new GraphQLList(ShoppingCartType),
      resolve(parent, args) {
        // find and return all shopping carts
        return ShoppingCart.find();
      }
    }
  }
});

module.exports = RootQuery;
