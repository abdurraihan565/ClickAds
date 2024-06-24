const { Schema, model } = require('mongoose');

// name ,slug, description ,country, points,time
const payoutSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, 'Email  is Required'],
      trim: true,
      lowercase: true,
      validator: function (v) {
        return /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/.test(v);
      },
      message: 'Please Inter a valid email',
    },
    paymentMethod: {
      type: String,
      required: [true, 'Payment Method is Required'],
      trim: true,
    },

    amount: {
      type: Number,
      required: [true, 'Amount  is Required'],
      minlength: [4, 'Minimum payouts 1000'],
      trim: true,
    },
  },
  { timestamps: true }
);

const Payouts = model('payouts', payoutSchema);
module.exports = Payouts;
