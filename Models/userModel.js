// models/user.js
const mongoose = require('mongoose');
const { Schema } = mongoose

const cartItemSchema = new Schema({
  product_id: {
    type: Number,
    ref:'products',
    required: true,
    
  },

  image: {
    type: String,
    ref:'products',
    required: true,
    
  },
  product_name: {
    type: String,
    ref:'products',
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


const userSchema = new Schema({
  user_id: { type: Number, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  cart: [cartItemSchema]
});

const userModel = mongoose.model('users', userSchema);
module.exports = userModel;
