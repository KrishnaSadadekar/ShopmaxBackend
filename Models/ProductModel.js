// models/product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    category: String,
    description: String,
    product_name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    image: String
}, {
    timestamps: true
});

const ProductModel = mongoose.model('products', productSchema);

module.exports = ProductModel;
