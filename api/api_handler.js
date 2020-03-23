require('dotenv').config();
const fs = require('fs');
const { ApolloServer } = require('apollo-server-express');

const product = require('./product.js');

const resolvers = {
  Query: {
    productList: product.list,
  },
  Mutation: {
    productAdd: product.add,
  },
};

const server = new ApolloServer({
  typeDefs: fs.readFileSync('schema.graphql', 'utf-8'),
  resolvers,
});

function installHandler(app) {
  server.applyMiddleware({ app, path: '/graphql' });
}

module.exports = { installHandler };
