const mongoose = require('mongoose');
const { MongodbURL } = require('../secret');

const connectDatabase = async (options = {}) => {
  try {
    await mongoose.connect(MongodbURL, options);
    console.log('Mongodb is connect succeccfully ');

    mongoose.connection.on('error', (error) => {
      console.error('DB connectet  error:', error);
    });
  } catch (error) {
    console.error('could not connect to DB :', error.toString());
  }
};

module.exports = connectDatabase;
