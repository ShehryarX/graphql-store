const express = require("express");
const graphqlHTTP = require("express-graphql");
const schema = require("./schema/schema");
const mongoose = require("mongoose");

const app = express();

mongoose.connect(
  "mongodb://shehryar:shopifyChallenge!1@ds151614.mlab.com:51614/shopify-challenge",
  { useNewUrlParser: true }
);

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
});

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true
  })
);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Listening to port ${port}`));
