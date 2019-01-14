const graphql = require("graphql");
const _ = require("lodash");
const Product = require("../models/Product");
const ShoppingCart = require("../models/ShoppingCart");

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
  { id: "1", title: "Google Pixel XL", price: 299.99, inventoryCount: 19 },
  { id: "2", title: "Macbook Pro 2018", price: 1299.99, inventoryCount: 2 },
  { id: "3", title: "Fitbit Versa", price: 155.49, inventoryCount: 39 }
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
    inventoryCount: {
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
          let res = Product.findById(productId);
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
        const { id } = args;
        return Product.findById(id);
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
        const { id } = args;
        return ShoppingCart.findById(id);
      }
    },
    products: {
      type: new GraphQLList(ProductType),
      resolve(parent, args) {
        return Product.find();
      }
    },
    availableProducts: {
      type: new GraphQLList(ProductType),
      resolve(parent, args) {
        return Product.find()
          .where("inventoryCount")
          .gt(0);
      }
    },
    shoppingCarts: {
      type: new GraphQLList(ShoppingCartType),
      resolve(parent, args) {
        return ShoppingCart.find();
      }
    }
  }
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addProduct: {
      type: ProductType,
      args: {
        title: { type: GraphQLString },
        price: { type: GraphQLFloat },
        inventoryCount: { type: GraphQLInt }
      },
      resolve(parent, args) {
        const { title, price, inventoryCount } = args;
        let product = new Product({
          title,
          price,
          inventoryCount
        });
        return product.save();
      }
    },
    addShoppingCart: {
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
    }
  }
});

module.exports = new GraphQLSchema({ query: RootQuery, mutation: Mutation });
