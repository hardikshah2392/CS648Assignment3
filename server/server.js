const fs = require('fs');
const express = require('express');
const { ApolloServer } = require('apollo-server-express');

const prods = [];

const resolvers = {
  Query: {
    productList,
  },
  Mutation: {
    addProduct,
  },
};


function addProduct(_, { product }) {
  product.id = prods.length + 1;
  prods.push(product);
  return product;
}


function productList() {
  return prods;
}
const server = new ApolloServer({
  typeDefs: fs.readFileSync('./server/schema.graphql', 'utf-8'),
  resolvers,
});

const app = express();
app.use(express.static('public'));
server.applyMiddleware({ app, path: '/graphql' });
app.listen(3000, function () {
  console.log('App started on port 3000');
});