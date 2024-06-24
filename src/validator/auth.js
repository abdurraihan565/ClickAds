const { body } = require('express-validator');

// registation validator
const validateUserRegistation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required.')
    .isLength({ min: 3, max: 31 })
    .withMessage('name should be 3 to 31 characters.'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('email is required.')
    .isEmail()
    .withMessage('Invaid Email Adreess.'),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('password is required.')
    .isLength({ min: 6 })
    .withMessage('password should be 6 characters long.'),

  body('country').trim().notEmpty().withMessage('country is required.'),
];

//password Update
const validateUserPasswordUpdate = [
  body('oldPassword')
    .trim()
    .notEmpty()
    .withMessage('Old Password is required.Please Enter old password')
    .isLength({ min: 6 })
    .withMessage('Old Password should be 6 characters long.'),
  body('newPassword')
    .trim()
    .notEmpty()
    .withMessage('new Password is required.Please Enter new password')
    .isLength({ min: 6 })
    .withMessage('new Password should be 6 characters long.'),
  body('comfirmedPassword').custom((value, { req }) => {
    if (value != req.body.newPassword) {
      throw new Error('newPassword or comfirmedPassword did not match.');
    }
    return true;
  }),
];
//forget password
const validateUserForgetPassword = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required.Please Enter Email.')
    .isEmail()
    .withMessage('Invaid Email Adreess.'),
];
//Reset Password
const validateUserResetPassword = [
  body('token').trim().notEmpty().withMessage('Token is Required'),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('password is required.please Inter new password')
    .isLength({ min: 6 })
    .withMessage('password should be 6 characters long.'),
];

//create product
const validateCreateProduct = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required.')
    .isLength({ min: 3 })
    .withMessage('name should be 3 chareacter long..'),
  body('slug')
    .trim()
    .notEmpty()
    .withMessage('slug is required.')
    .isLength({ min: 3 })
    .withMessage('slug should be 3 chareacter long..'),

  body('description').trim().notEmpty().withMessage('description is required.'),

  body('country').trim().notEmpty().withMessage('country is required.'),
  body('points').trim().notEmpty().withMessage('points is required.'),
  body('time').trim().notEmpty().withMessage('Time is required.'),
];

//create payouts
const validateCreatePayouts = [
  body('email').trim().notEmpty().withMessage('email is required.'),

  body('paymentMethod')
    .trim()
    .notEmpty()
    .withMessage('Payeer Account is required.')
    .isLength({ min: 11 })
    .withMessage('You Must be Provide Valid Number'),

  body('amount')
    .trim()
    .notEmpty()
    .withMessage('Amount is required.')
    .isLength({ min: 4 })
    .withMessage('You Can Withdraw When Your Amount are minimum 1000 Points.'),
];
//contact
const validateContactMessage = [
  body('email').trim().notEmpty().withMessage('Email is required.'),

  body('message')
    .trim()
    .notEmpty()
    .withMessage('Message is required.')
    .isLength({ min: 10 })
    .withMessage('Message should be minimum less than 10  characters long .'),
];

module.exports = {
  validateUserRegistation,
  validateUserPasswordUpdate,
  validateUserForgetPassword,
  validateUserResetPassword,
  validateCreateProduct,
  validateCreatePayouts,
  validateContactMessage,
};
