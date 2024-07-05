// models/Order.js
const mongoose = require('mongoose');
const { Schema } = mongoose
const cartItemSchema = new Schema({
  product_id: {
    type: Number,
    ref: 'products',
    required: true,

  },

  image: {
    type: String,
    ref: 'products',
    required: true,

  },
  product_name: {
    type: String,
    ref: 'products',
    required: true,

  },
  size:
  {
    type: String,
    required: true,

  },
  qty: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true,

  }

});

const orderSchema = new mongoose.Schema({
  order_id: {
    type: Number
  },
  user_id: {
    type: Number,
    ref: 'User',
    required: true
  },
  products: [cartItemSchema],
  totalAmount: {
    type: Number,
    required: true
  },
  shippingAddress: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    address1: { type: String, required: true },
    address2: { type: String, required: true },
    stateCountry: { type: String, required: true },
    postalZip: { type: String, required: true },
    
  },
  paymentMethod: {
    type: String,
    required: true
  },
  paymentResult: {
    id: String,
    status: String,
    update_time: String,
    email_address: String
  },
  status: {
    type: String,
    default: 'Pending'
  },
  rzp_order_id: {
    type: String,
    // Ensure uniqueness to avoid duplicate entries
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Order', orderSchema);
