const createError = require('http-errors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const User = require('../models/userModel');
const { successResponse } = require('./responseControllers');
const { mongoose } = require('mongoose');
const { findWithId } = require('../services/findItem');
const { deleteImage } = require('../helper/deleteImage');
const { createJSONWebToken } = require('../helper/jsonwebtoken');
const {
  jwtActivationKey,
  clintURL,
  jwtResetPasswordKey,
} = require('../secret');
const { emailWithNodeMailer } = require('../helper/email');

const getUsers = async (req, res, next) => {
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
    const users = await User.find(filter, options)
      .limit(limit)
      .skip((page - 1) * limit);

    const count = await User.find(filter).countDocuments();
    if (!users) throw createError('404', 'Users not found');

    return successResponse(res, {
      statusCode: 200,
      message: 'Users were return successfully',
      payload: {
        users,
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

// get sigle user
const getUserById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const options = { password: 0 };

    const user = await findWithId(User, id, options);

    return successResponse(res, {
      statusCode: 200,
      message: 'User were return successfully',
      payload: { user },
    });
  } catch (error) {
    next(error);
  }
};

// delete signle user
const deleteUserById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const options = { password: 0 };

    const user = await findWithId(User, id, options);
    const userImagePath = user.image;

    deleteImage(userImagePath);

    await User.findByIdAndDelete({
      _id: id,
      idAdmin: false,
    });
    return successResponse(res, {
      statusCode: 200,
      message: 'User was deleted succesfully',
      payload: user,
    });
  } catch (error) {
    next(error);
  }
};

//processs-register
const processRegister = async (req, res, next) => {
  try {
    const { name, email, password, country } = req.body;
    const userExists = await User.exists({ email: email });
    if (userExists) {
      throw createError(
        409,
        'User with this email already exist.please Login .'
      );
    }
    //CREATE JWT
    const token = createJSONWebToken(
      { name, email, password, country },
      jwtActivationKey,
      '10m'
    );

    //PREPERE EMAIL
    const emailData = {
      email,
      subject: 'Account Activation Email',
      html: `
    <h2> Hellow ${name} </h2>
    <p> please click here to <a href="${clintURL}/api/users/activate/${token}" target="_blank"> activate your account </a> </p>
    `,
    };

    // send email with nodeMailer
    try {
      emailWithNodeMailer(emailData);
    } catch (emailError) {
      next(createError(500, 'Fail to send varification email'));
      return;
    }

    return successResponse(res, {
      statusCode: 200,
      message: `PLease go to your ${email} for completing Your Registation Process `,
      payload: { token },
    });
  } catch (error) {
    next(error);
  }
};

//activate user account
const activateUserAccount = async (req, res, next) => {
  try {
    const token = req.body.token;
    if (!token) throw createError(404, 'token not found');
    const decoded = jwt.verify(token, jwtActivationKey);
    if (!decoded) throw createError(401, 'User was not able to verified');

    const userExists = await User.exists({ email: decoded.email });
    if (userExists) {
      throw createError(
        409,
        'User with this email already exist.please sign in.'
      );
    }
    await User.create(decoded);

    return successResponse(res, {
      statusCode: 200,
      message: `You Are successfully Register . Please `,
    });
  } catch (error) {
    if (error.name == 'TokenExpiredError') {
      throw createError(401, 'Token has Expired');
    } else if (error.name == 'jsonWebTokenError') {
      throw createError(401, 'invaild token');
    } else {
      next(error);
    }
  }
};

// update userbyid
const updateUserById = async (req, res, next) => {
  try {
    const userid = req.params.id;
    const options = { password: 0 };
    await findWithId(User, userid, options);
    const updateOptions = { new: true, runValidators: true, context: 'query' };

    let updates = {};

    if (req.body.name) {
      updates.name = req.body.name;
    }
    if (req.body.email) {
      updates.email = req.body.email;
    }
    if (req.body.password) {
      updates.password = req.body.password;
    }
    if (req.body.country) {
      updates.country = req.body.country;
    }
    if (req.body.points) {
      updates.points = req.body.points;
    }

    const updateUser = await User.findByIdAndUpdate(
      userid,
      updates,
      updateOptions
    );
    if (!updateUser) {
      throw createError(404, 'User dose not exist with is ID.');
    }

    return successResponse(res, {
      statusCode: 200,
      message: 'User was Updated succesfully',
      payload: { updateUser },
    });
  } catch (error) {
    next(error);
  }
};
//handle userbyid
const handleBanUserById = async (req, res, next) => {
  try {
    const userid = req.params.id;
    const Updates = { isBanned: true };
    await findWithId(User, userid);
    const updateOptions = { new: true, runValidators: true, context: 'query' };

    const updateUser = await User.findByIdAndUpdate(
      userid,
      Updates,
      updateOptions
    ).select('-password');
    if (!updateUser) {
      throw createError(404, 'User was not ban successfuly.');
    }

    return successResponse(res, {
      statusCode: 200,
      message: 'user was Ban succesfully',
      payload: { updateUser },
    });
  } catch (error) {
    next(error);
  }
};
//handle unban userid
const handleunBanUserById = async (req, res, next) => {
  try {
    const userid = req.params.id;
    const Updates = { isBanned: false };
    await findWithId(User, userid);
    const updateOptions = { new: true, runValidators: true, context: 'query' };

    const updateUser = await User.findByIdAndUpdate(
      userid,
      Updates,
      updateOptions
    ).select('-password');
    if (!updateUser) {
      throw createError(404, 'User was not ban successfuly.');
    }

    return successResponse(res, {
      statusCode: 200,
      message: 'user was UnBan succesfully',
      payload: { updateUser },
    });
  } catch (error) {
    next(error);
  }
};

//Update Password
const handleUpdatePassword = async (req, res, next) => {
  try {
    const userid = req.params.id;
    const { oldPassword, newPassword } = req.body;

    const user = await findWithId(User, userid);
    /*
    if (!user) {
      throw createError(404, 'User dose not exist with this id .');
    }
    */
    //compare the password
    const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordMatch) {
      throw createError(400, 'Old  password dose not match.');
    }

    const updateUser = await User.findByIdAndUpdate(
      userid,
      { password: newPassword },
      { new: true }
    ).select('-password');
    if (!updateUser) {
      throw createError(404, 'Password was not update successfuly.');
    }

    return successResponse(res, {
      statusCode: 200,
      message: 'Password Was Update succesfully',
      payload: { updateUser },
    });
  } catch (error) {
    next(error);
  }
};
//User Forget Password
const handleForgetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const userData = await User.findOne({ email: email });
    if (!userData) {
      throw createError(404, 'Email is Incoreect.please Register now.');
    }

    //CREATE JWT
    const token = createJSONWebToken({ email }, jwtResetPasswordKey, '10m');

    //PREPERE EMAIL
    const emailData = {
      email,
      subject: 'Password Reset Email',
      html: `
         <h2> Hellow ${userData.name} </h2>
        <p> Please click here to <a href="${clintURL}/api/users/reset-password/${token}" target="_blank"> Reset Your Password </a> </p>
           `,
    };

    // send email with nodeMailer
    try {
      emailWithNodeMailer(emailData);
    } catch (emailError) {
      next(createError(500, 'Fail to Reset password email'));
      return;
    }

    return successResponse(res, {
      statusCode: 200,
      message: `PLease go to Your ${email} for Reseting your password. `,
      payload: { token },
    });
  } catch (error) {
    next(error);
  }
};
// handle Reset Password
const handleResetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    const decoded = jwt.verify(token, jwtResetPasswordKey);
    if (!decoded) {
      throw createError(404, 'Reset token expired');
    }
    const filter = { email: decoded.email };
    const updateUser = await User.findOneAndUpdate(
      filter,
      { password: password },
      { new: true }
    ).select('-password');
    if (!updateUser) {
      throw createError(404, 'Password Reset Failed.');
    }

    return successResponse(res, {
      statusCode: 200,
      message: 'Reset Password Was Update succesfully',
      payload: {},
    });
  } catch (error) {
    next(error);
  }
};

//Update Points
const updateUserPoints = async (req, res, next) => {
  try {
    const userid = req.params.id;
    const options = { password: 0 };
    await findWithId(User, userid, options);
    const updateOptions = { new: true, runValidators: true, context: 'query' };

    let updates = {};

    if (req.body.points) {
      updates.points = req.body.points;
    }

    const updateUser = await User.findByIdAndUpdate(
      userid,
      updates,
      updateOptions
    );
    if (!updateUser) {
      throw createError(404, 'User dose not exist with is ID.');
    }

    return successResponse(res, {
      statusCode: 200,
      message: 'You have Earn ',
      payload: { updateUser },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  getUserById,
  deleteUserById,
  processRegister,
  activateUserAccount,
  updateUserById,
  handleBanUserById,
  handleunBanUserById,
  handleUpdatePassword,
  handleForgetPassword,
  handleResetPassword,
  updateUserPoints,
};
