const createError = require('http-errors');
const { findWithId } = require('../services/findItem');
const { successResponse } = require('./responseControllers');
const Payouts = require('../models/payoutsModels');

// cerate payment
const handleCreatePayouts = async (req, res, next) => {
  try {
    const { email, paymentMethod, amount } = req.body;

    //create product
    const payouts = await Payouts.create({
      email: email,
      paymentMethod,
      amount,
    });

    return successResponse(res, {
      statusCode: 200,
      message:
        'Your payout process successfully created.Please Wait for 1-2 Business days.',
      payload: { payouts },
    });
  } catch (error) {
    next(error);
  }
};

//get all payouts
const handleAllPayouts = async (req, res, next) => {
  try {
    const search = req.query.search || '';
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 100;

    const searchRegExp = new RegExp('.*' + search + '.*', 'i');

    filter = {
      idAdmin: { $ne: true },
      $or: [
        { name: { $regex: searchRegExp } },
        { email: { $regex: searchRegExp } },
        // { phone: { $regex: searchRegExp } },
      ],
    };

    const options = { password: 0 };
    const payouts = await Payouts.find(filter, options)
      .limit(limit)
      .skip((page - 1) * limit);

    const count = await Payouts.find(filter).countDocuments();
    if (!payouts) throw createError('404', 'Payouts not found');

    return successResponse(res, {
      statusCode: 200,
      message: 'User payouts were return successfully',
      payload: {
        payouts,
        pagination: {
          totalPages: Math.ceil(count / limit),
          currentPage: page,
          previousPage: page - 1 > 0 ? page - 1 : null,
          nextPage: page + 1 <= Math.ceil(count / limit) ? page + 1 : null,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  handleCreatePayouts,
  handleAllPayouts,
};
