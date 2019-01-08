const graphql = require("graphql");
const _ = require("lodash");

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLFloat,
  GraphQLInt,
  GraphQLSchema
} = graphql;

// dummy data
let products = [
  { id: "1", title: "Google Pixel XL", price: 299.99, inventory_count: 19 },
  { id: "2", title: "Macbook Pro 2018", price: 1299.99, inventory_count: 2 },
  { id: "3", title: "Fitbit Versa", price: 155.49, inventory_count: 39 }
];

const ProductType = new GraphQLObjectType({
  name: "Product",
  fields: () => ({
    id: {
      type: GraphQLString
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

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    product: {
      type: ProductType,
      args: {
        id: {
          type: GraphQLString
        },
        resolve(parent, args) {
          // fetch from database
          return _.find(products, { id: args.id });
        }
      }
    }
  }
});

// const ShoppingCartType = new GraphQLObjectType({
//   name: "Shopping Cart",
//   fields: {() => ({})}
// });

module.exports = new GraphQLSchema(RootQuery);
