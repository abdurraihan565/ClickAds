const data = require('../data');
const product = require('../models/productModel');
const User = require('../models/userModel');

const seedUser = async (req, res, next) => {
  try {
    //deteting all exsiting users
    await User.deleteMany({});
    // insert new users
    const users = await User.insertMany(data.users);

    return res.status(201).json(users);
  } catch (error) {
    next(error);
  }
};

//seed products
const seedProducts = async (req, res, next) => {
  try {
    //deteting all exsiting users
    await product.deleteMany({});
    // insert new users
    const products = await product.insertMany(data.products);

    return res.status(201).json(products);
  } catch (error) {
    next(error);
  }
};

module.exports = { seedUser, seedProducts };
