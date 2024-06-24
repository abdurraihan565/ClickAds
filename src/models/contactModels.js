const { Schema, model } = require('mongoose');

const contactSchema = new Schema(
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
    message: {
      type: String,
      required: [true, ' Message is Required'],
      trim: true,
    },
  },
  { timestamps: true }
);

const Contact = model('contact', contactSchema);
module.exports = Contact;
