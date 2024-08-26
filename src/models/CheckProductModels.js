const { Schema, model } = require('mongoose');

const checkProductSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, 'email is Required'],
      trim: true,
      unique: true,
      lowercase: true,
      validator: function (v) {
        return /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/.test(v);
      },
      message: 'please inter a valid email',
    },
    productid: {
      type: String,
      required: [true, 'productid  is Required'],
      trim: true,
    },
  },
  { timestamps: true }
);

const checkProduct = model('checkProduct', checkProductSchema);
module.exports = checkProduct;
