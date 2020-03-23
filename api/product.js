const { getDb, getNextSequence } = require('./db.js');

async function list() {
  const db = getDb();
  const products = await db.collection('products').find({}).toArray();
  console.log(products);
  return products;
}

async function add(_, { product }) {
  console.log('add product');
  const db = getDb();
  const newProduct = { ...product };
  newProduct.id = await getNextSequence('products');
  console.log(newProduct.id);
  const result = await db.collection('products').insertOne(newProduct);
  const savedProduct = await db.collection('products')
    .findOne({ _id: result.insertedId });
  return savedProduct;
}

module.exports = { list, add };
