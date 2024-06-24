const express = require('express');
const {
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
} = require('../controllers/userController');
const {
  validateUserRegistation,
  validateUserPasswordUpdate,
  validateUserForgetPassword,
  validateUserResetPassword,
} = require('../validator/auth');
const { runValidaton } = require('../validator');
const { isLogedIn, isLogedOut, isAdmin } = require('../midelwares/auth');

const userRouter = express.Router();
userRouter.post(
  '/process-register',
  isLogedOut,
  validateUserRegistation,
  runValidaton,
  processRegister
);
userRouter.post('/verify', activateUserAccount);
userRouter.get('/', getUsers);
userRouter.get('/:id', getUserById);
userRouter.delete('/:id', deleteUserById);
userRouter.put(
  '/reset-password',
  validateUserResetPassword,
  runValidaton,
  handleResetPassword
);
userRouter.put('/:id', updateUserById);
userRouter.put('/update-user-points/:id', updateUserPoints);
userRouter.put('/ban-user/:id', handleBanUserById);
userRouter.put('/unban-user/:id', handleunBanUserById);
userRouter.put(
  '/update-password/:id',
  validateUserPasswordUpdate,
  runValidaton,
  isLogedIn,
  handleUpdatePassword
);
userRouter.post(
  '/forget-password',
  validateUserForgetPassword,
  runValidaton,
  handleForgetPassword
);

module.exports = userRouter;
