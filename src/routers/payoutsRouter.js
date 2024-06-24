const express = require('express');
const {
  handleCreatePayouts,
  handleAllPayouts,
  getPayoutsByemail,
} = require('../controllers/payoutsController');
const { validateCreatePayouts } = require('../validator/auth');
const { runValidaton } = require('../validator');
const payoutsRouter = express.Router();

payoutsRouter.post(
  '/',
  validateCreatePayouts,
  runValidaton,
  handleCreatePayouts
);
payoutsRouter.get('/all-payouts', handleAllPayouts);

module.exports = payoutsRouter;
