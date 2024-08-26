const express = require('express');
const { runValidaton } = require('../validator');
const {
  handleLogin,
  handleLogout,
  handleRefreshToken,
  handleProtected,
} = require('../controllers/authController');
const { isLogedOut, isLogedIn } = require('../midelwares/auth');
const { handleCheckProduct } = require('../controllers/checkProductController');

const authRouter = express.Router();

authRouter.post('/login', isLogedOut, handleLogin);
authRouter.post('/logout', isLogedIn, handleLogout);
authRouter.get('/refresh-token', handleRefreshToken);
authRouter.get('/protected', handleProtected);
// check product
authRouter.post('/check-product', handleCheckProduct);

module.exports = authRouter;
