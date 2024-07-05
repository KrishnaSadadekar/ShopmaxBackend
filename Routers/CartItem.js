// routers/cart.js
const express = require('express');
const mongoose = require('mongoose');
const User = require('../Models/userModel');
const Product = require('../Models/ProductModel');

const router = express.Router();

router.post('/addtocart', async (req, res) => {
    try {
        const { email, size, qty, product_id } = req.body.item;
       
        
        console.log('email ', email, 'size ', size, 'ProductID ', product_id);
        const product = await Product.findOne({ product_id });
        if (!product) {
            return res.status(404).json({ msg: 'Product not found' });
        }

        // Validate quantity
        if (qty <= 0) {
            return res.status(400).json({ msg: 'Quantity must be greater than zero' });
        }
        let user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        console.log('Adding to cart:', { product_id, size, qty, price: product.price });

        const cartItemIndex = user.cart.findIndex((item) => (item.product_id === product_id && item.size === size));
        if (cartItemIndex > -1) {
            console.log('----------')
            user.cart[cartItemIndex].qty += qty;
            console.log('cartItem: ', cartItemIndex)
        }
        else {
            user.cart.push({ product_id: product_id, image: product.image, product_name: product.product_name, qty: qty, size: size, price: product.price });
        }
        await user.save();


        return res.json({ success: true });

    } catch (error) {
        console.error('Error adding to cart:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
});


router.post('/removeitem', async (req, res) => {
    console.log('----')
    const { email, product_id, size } = req.body;
    console.log(req.body);
    const user = await User.findOne({ email });
    try {


        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.cart = user.cart.filter((item) => (item.product_id !== product_id || item.size !== size));
         await user.save();
        res.json({cart:user.cart});
        // res.json({ message: 'Item removed from cart', cart: user.cart });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
})


router.post('/cart', async (req, res) => {
    const { email } = req.body;
    try {

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }


        res.json(user.cart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }

})


router.post('/clearcart', async (req, res) => {
    try {
        const { email } = req.body;

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Find the cart by user ID and clear it
        user.cart = [];
        
        await user.save(); // Save the updated cart

        return res.json(user.cart);
    } catch (error) {
        console.error('Error clearing cart:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
});


module.exports = router;
