const createError = require('http-errors');
const User = require('../models/userModel');
const { mongoose } = require('mongoose');

const findWithId = async (Model, id, options = {}) => {
  try {
    const item = await Model.findById(id, options);
    if (!item) {
      throw createError(404, `${Model.modelName} dose not exist with this id`);
    }
    return item;
  } catch (error) {
    if (error instanceof mongoose.Error) {
      throw createError(400, 'Invaild item  id');
      return;
    }
    throw error;
  }
};
module.exports = { findWithId };
