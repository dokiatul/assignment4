require('dotenv').config();
const fs = require('fs');
const express = require('express');
const { ApolloServer, UserInputError } = require('apollo-server-express');
const { MongoClient } = require('mongodb');

const url = process.env.DB_URL || 'mongodb+srv://atuldoki:0wGuxlgRmOZOWYKU@fullstack-yyooy.mongodb.net/producttracker?retryWrites=true';

const port = process.env.API_SERVER_PORT || 3000;

let db;

let aboutMessage = "Product Tracker API v1.0";

const app = express();

const resolvers = {
  Query: {
    productList,
  },
  Mutation: {
    productAdd,
  },
};

const productsDB = [];

async function getNextSequence(name) {
  const result = await db.collection('counters').findOneAndUpdate(
    { _id: name },
    { $inc: { current: 1 } },
    { returnOriginal: false },
  );
  return result.value.current;
}

async function productAdd(_, { product }) {
  //product.id = productsDB.length + 1;
  //productsDB.push(product);
  console.log('ad product');
  product.id = await getNextSequence('products');
  console.log(product.id);
  const result = await db.collection('products').insertOne(product);
  const savedProduct = await db.collection('products')
    .findOne({ _id: result.insertedId });
  return savedProduct;
  //return product;
}

async function productList() {
  const products = await db.collection('products').find({}).toArray();
  console.log(products)
  return products;
  //return productsDB;
}

async function connectToDb() {
  const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  console.log('Connected to MongoDB at', url);
  db = client.db();
}

const server = new ApolloServer({
  typeDefs: fs.readFileSync('schema.graphql', 'utf-8'),
  resolvers,
});

server.applyMiddleware({ app, path: '/graphql' });

(async function () {
  try {
    await connectToDb();
    app.listen(port, function () {
      console.log(`API started on port ${port}`);
    });
  } catch (err) {
    console.log('ERROR:', err);
  }
})();
