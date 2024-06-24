const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');
const { defaultImagePath } = require('../secret');
// name ,slug, description ,country, points,time
const productSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'product name is Required'],
      trim: true,
      minlength: [3, 'this length of user name can be minimun 3 character'],
    },
    slug: {
      type: String,
      required: [true, 'product slug is Required'],
      trim: true,
      minlength: [3, 'this length of user name can be minimun 3 character'],
    },

    description: {
      type: String,
      required: [true, 'Description  is Required'],
      trim: true,
      minlength: [
        3,
        'this length of user products can be minimun 3 character long.',
      ],
    },
    country: {
      type: String,
      required: [true, 'Country  is Required'],
      trim: true,
    },
    points: {
      type: Number,
      required: [true, 'Points  is Required'],
      trim: true,
      validate: {
        validator: (v) => v > 0,
        message: (props) =>
          `${props.value} is not a valid points.points must be gater than 0.`,
      },
    },
    time: {
      type: Number,
      required: [true, 'Time is Required'],
      trim: true,
      validate: {
        validator: (v) => v > 0,
        message: (props) =>
          `${props.value} is not a valid time.time must be gater than 0.`,
      },
    },
  },
  { timestamps: true }
);

const Product = model('product', productSchema);
module.exports = Product;
