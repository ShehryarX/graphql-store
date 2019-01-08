const graphql = require("graphql");
const _ = require("lodash");

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLFloat,
  GraphQLInt,
  GraphQLSchema,
  GraphQLID
} = graphql;

// dummy data
let products = [
  { id: "1", title: "Google Pixel XL", price: 299.99, inventory_count: 19 },
  { id: "2", title: "Macbook Pro 2018", price: 1299.99, inventory_count: 2 },
  { id: "3", title: "Fitbit Versa", price: 155.49, inventory_count: 39 }
];

let shoppingCarts = [{ id: "1" }, { id: "2" }, { id: "3" }];

const ProductType = new GraphQLObjectType({
  name: "Product",
  fields: () => ({
    id: {
      type: GraphQLID
    },
    title: {
      type: GraphQLString
    },
    price: {
      type: GraphQLFloat
    },
    inventory_count: {
      type: GraphQLInt
    }
  })
});

const ShoppingCartType = new GraphQLObjectType({
  name: "ShoppingCart",
  fields: () => ({
    id: {
      type: GraphQLID
    }
    // // products
    // total: {
    //   type: GraphQLFloat
    // }
  })
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    product: {
      type: ProductType,
      args: {
        id: {
          type: GraphQLID
        }
      },
      resolve(parent, args) {
        // fetch from database
        return _.find(products, { id: args.id });
      }
    },
    shoppingCart: {
      type: ShoppingCartType,
      args: {
        id: {
          type: GraphQLID
        }
      },
      resolve(parent, args) {
        return _.find(shoppingCarts, { id: args.id });
      }
    }
  }
});

module.exports = new GraphQLSchema({ query: RootQuery });
