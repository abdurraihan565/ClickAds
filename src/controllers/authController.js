const createError = require('http-errors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const { successResponse } = require('./responseControllers');
const { jwtAccesskey, jwtRefreshKey } = require('../secret');
const { createJSONWebToken } = require('../helper/jsonwebtoken');

const handleLogin = async (req, res, next) => {
  try {
    //email password req.body
    const { email, password } = req.body;
    //isExsist
    const user = await User.findOne({ email });
    if (!user) {
      throw createError(
        404,
        'You are dose not Exist With This Email . Pleaes Register Now'
      );
    }
    //compare the password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw createError(401, ' Email or Password dose not Match.');
    }
    //isbanned

    if (user.isBanned) {
      throw createError(
        403,
        'You are already banned. Please Contact Authrity.'
      );
    }
    //token,cookie
    const AccessToken = createJSONWebToken({ user }, jwtAccesskey, '1m');
    res.cookie('access_token', AccessToken, {
      maxAge: 15 * 60 * 1000,
      httpOnly: true,
      //secure: true,
      sameSite: 'none',
    });

    //Refresh token,cookie
    const refreshToken = createJSONWebToken({ user }, jwtRefreshKey, '7d');
    res.cookie('refresh_token', refreshToken, {
      maxAge: 7 * 24 * 60 * 60 * 1000, //7days
      httpOnly: true,
      //secure: true,
      sameSite: 'none',
    });
    //success response
    return successResponse(res, {
      statusCode: 200,
      message: 'You are successfully logged in .',
      payload: { user },
    });
  } catch (error) {
    next(error);
  }
};

const handleLogout = async (req, res, next) => {
  try {
    //success response
    res.clearCookie('access_token');
    return successResponse(res, {
      statusCode: 200,
      message: 'You are successfully loged out.',
      payload: {},
    });
  } catch (error) {
    next(error);
  }
};

const handleRefreshToken = async (req, res, next) => {
  try {
    const oldRefreshToken = req.cookies.refresh_token;
    const decodedToken = jwt.verify(oldRefreshToken, jwtRefreshKey);
    if (!decodedToken) {
      throw createError(401, 'Invalid Refresh Token. Please Login again.');
    }

    const AccessToken = createJSONWebToken(
      decodedToken.user,
      jwtAccesskey,
      '1m'
    );
    res.cookie('access_token', AccessToken, {
      maxAge: 15 * 60 * 1000,
      httpOnly: true,
      //secure: true,
      sameSite: 'none',
    });
    return successResponse(res, {
      statusCode: 200,
      message: 'New Access Token grenareted.',
      payload: {},
    });
  } catch (error) {
    next(error);
  }
};
const handleProtected = async (req, res, next) => {
  try {
    const oldRefreshToken = req.cookies.refresh_token;
    const decodedToken = jwt.verify(oldRefreshToken, jwtRefreshKey);
    if (!decodedToken) {
      throw createError(401, 'Invalid Access Token. Please Login again.');
    }

    return successResponse(res, {
      statusCode: 200,
      message: 'Proteted token successfully.',
      payload: {},
    });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  handleLogin,
  handleLogout,
  handleRefreshToken,
  handleProtected,
};
