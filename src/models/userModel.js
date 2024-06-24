const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');
const { defaultImagePath } = require('../secret');

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'User email is Required'],
      trim: true,
      lowercase: true,
      minlength: [3, 'this length of user name can be minimun 3 character'],
      maxlength: [31, 'this length of user name can be mxxium 31 character'],
    },

    email: {
      type: String,
      required: [true, 'User name is Required'],
      trim: true,
      unique: true,
      lowercase: true,
      validator: function (v) {
        return /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/.test(v);
      },
      message: 'please inter a valid email',
    },

    password: {
      type: String,
      required: [true, 'User password is Required'],
      minlength: [6, 'the length of user password can be minium 6 character'],
      set: (v) => bcrypt.hashSync(v, bcrypt.genSaltSync(10)),
    },

    image: {
      type: String,
      default: defaultImagePath,
    },

    country: {
      type: String,
      required: [true, 'country is requred'],
    },
    points: {
      type: Number,
      default: 0,
      //required: [true, 'Points is requred'],
    },

    isAdmin: {
      type: Boolean,
      default: false,
    },

    isBanned: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const User = model('Users', userSchema);
module.exports = User;
