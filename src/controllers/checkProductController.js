const { successResponse } = require('./responseControllers');
const checkProduct = require('../models/checkProductModels');
const createError = require('http-errors');

// check cerate product
const handleCheckProduct = async (req, res, next) => {
  try {
    const { email, productid } = req.body;
    //isExsist
    const userExists = await checkProduct.exists({
      email: email,
      productid: productid,
    });
    if (userExists) {
      throw createError(409, ' Already Viewed, Choose a Different One !');
    }

    // create check product
    const validProduct = await checkProduct.create({
      email: email,
      productid: productid,
    });

    return successResponse(res, {
      statusCode: 200,
      message: 'Check Product was created successfully',
      payload: { validProduct },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  handleCheckProduct,
};

