const createError = require('http-errors');
const { jwtAccesskey } = require('../secret');
const jwt = require('jsonwebtoken');
const Product = require('../models/productModel');

const isLogedIn = async (req, res, next) => {
  try {
    const accessToken = req.cookies.access_token;

    if (!accessToken) {
      throw createError(401, 'access token not found.please log in. ');
    }
    const decoded = jwt.verify(accessToken, jwtAccesskey);

    if (!decoded) {
      throw createError(401, 'Invalid Aceess token.please log in again.');
    }
    req.user = decoded.user;
    next();
  } catch (error) {
    return next(error);
  }
};

const isLogedOut = async (req, res, next) => {
  try {
    const accessToken = req.cookies.access_token;

    if (accessToken) {
      try {
        const decoded = jwt.verify(accessToken, jwtAccesskey);
        if (decoded) {
          throw createError(400, 'User Was already log in. ');
        }
      } catch (error) {
        throw error;
      }
    }

    next();
  } catch (error) {
    return next(error);
  }
};

const isAdmin = async (req, res, next) => {
  try {
    console.log(req.user.isAdmin);
    if (!req.user.isAdmin) {
      throw createError(403, 'Forbiden.You Must be an Admin. ');
    }

    next();
  } catch (error) {
    return next(error);
  }
};

module.exports = { isLogedIn, isLogedOut, isAdmin };
