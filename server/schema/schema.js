const graphql = require("graphql");

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLFloat,
  GraphQLInt,
  GraphQLSchema
} = graphql;

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
          // code to get data from db
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
