const express = require('express');

const { runValidaton } = require('../validator');
const { isLogedIn, isLogedOut, isAdmin } = require('../midelwares/auth');
const {
  handleCreateProducts,
  handleCreateProduct,
  handleDeleteProduct,
  handleUpdateProduct,
} = require('../controllers/productsControllers');
const { validateCreateProduct } = require('../validator/auth');

const productsRouter = express.Router();

productsRouter.get('/', handleCreateProducts);
productsRouter.post(
  '/create-product',
  validateCreateProduct,
  runValidaton,
  handleCreateProduct
);

productsRouter.delete(
  '/:id',

  handleDeleteProduct
);
productsRouter.put(
  '/:id',

  handleUpdateProduct
);

module.exports = productsRouter;
