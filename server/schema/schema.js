const graphql = require("graphql");
const _ = require("lodash");

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLFloat,
  GraphQLInt,
  GraphQLSchema,
  GraphQLID,
  GraphQLList,
  GraphQLNonNull
} = graphql;

// dummy data
let products = [
  { id: "1", title: "Google Pixel XL", price: 299.99, inventory_count: 19 },
  { id: "2", title: "Macbook Pro 2018", price: 1299.99, inventory_count: 2 },
  { id: "3", title: "Fitbit Versa", price: 155.49, inventory_count: 39 }
];

let shoppingCarts = [
  { id: "1", numberOfItems: 2, products: ["1"], totalPrice: 2.99 },
  { id: "2", numberOfItems: 1, products: ["1", "2", "3"], totalPrice: 24.99 },
  { id: "3", numberOfItems: 30, products: ["3"], totalPrice: 26.99 }
];

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
    },
    products: {
      type: new GraphQLList(ProductType),
      resolve(parent, args) {
        let found = [];
        parent.products.forEach(productId => {
          let res = _.find(products, { id: productId });
          found.push(res);
        });
        return found;
      }
    },
    numberOfItems: {
      type: GraphQLInt
    },
    totalPrice: {
      type: GraphQLFloat
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
