const createError = require('http-errors');
const { findWithId } = require('../services/findItem');
const Product = require('../models/productModel');
const { successResponse } = require('./responseControllers');
const { checkUserClick } = require('../midelwares/auth');
//get all products
const handleCreateProducts = async (req, res, next) => {
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
    const products = await Product.find(filter, options)
      .limit(limit)
      .skip((page - 1) * limit);

    const count = await Product.find(filter).countDocuments();
    if (!products) throw createError('404', 'products not found');

    return successResponse(res, {
      statusCode: 200,
      message: 'users were return successfully',
      payload: {
        products,
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
// cerate product
const handleCreateProduct = async (req, res, next) => {
  try {
    const { name, slug, description, country, points, time } = req.body;
    const productExists = await Product.exists({ name: name });
    const productSlugExists = await Product.exists({ slug: slug });
    if (productExists) {
      throw createError(
        409,
        'Product with this name already exist.please create a new '
      );
    }

    if (productSlugExists) {
      throw createError(
        409,
        'Product with this slug already exist.please create a new .'
      );
    }
    //create product
    const product = await Product.create({
      name: name,
      slug: slug,
      description: description,
      country: country,
      points: points,
      time: time,
    });

    return successResponse(res, {
      statusCode: 200,
      message: 'Product was created successfully',
      payload: { product },
    });
  } catch (error) {
    next(error);
  }
};
// delete product
const handleDeleteProduct = async (req, res, next) => {
  try {
    const id = req.params.id;
    const product = await findWithId(Product, id);
    if (!product) {
      throw createError(404, ' Product Not Found.');
    }
    await Product.findByIdAndDelete({
      _id: id,
    });
    return successResponse(res, {
      statusCode: 200,
      message: 'Product was deleted succesfully',
      payload: product,
    });
  } catch (error) {
    next(error);
  }
};

//update product
const handleUpdateProduct = async (req, res, next) => {
  try {
    const id = req.params.id;

    await findWithId(Product, id);
    const updateOptions = { new: true, runValidators: true, context: 'query' };

    let updates = {};

    if (req.body.name) {
      updates.name = req.body.name;
    }
    if (req.body.slug) {
      updates.slug = req.body.slug;
    }
    if (req.body.description) {
      updates.description = req.body.description;
    }
    if (req.body.country) {
      updates.country = req.body.country;
    }
    if (req.body.points) {
      updates.points = req.body.points;
    }
    if (req.body.time) {
      updates.time = req.body.time;
    }

    const updateProduct = await Product.findByIdAndUpdate(
      id,
      updates,
      updateOptions
    );
    if (!updateProduct) {
      throw createError(404, 'Product dose not exist with This ID.');
    }

    return successResponse(res, {
      statusCode: 200,
      message: 'Product was Updated succesfully',
      payload: { updateProduct },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  handleCreateProducts,
  handleCreateProduct,
  handleDeleteProduct,
  handleUpdateProduct,
};
