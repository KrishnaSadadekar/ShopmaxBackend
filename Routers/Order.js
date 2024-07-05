// Express router for handling orders and payments
const express = require('express');
const router = express.Router();
const Order = require('../Models/OrderModel');
const User = require('../Models/userModel');
const crypto = require('crypto');
const Razorpay = require('razorpay');

// Move keys to environment variables for security
const rzp_key_id = process.env.RZP_KEY_ID || "rzp_test_J4gQkx1Sk61kFL";
const rzp_key_secret = process.env.RZP_KEY_SECRET || "EZUydtyYoP6m4NgA9t1wO7Za";

// Create Razorpay instance
const instance = new Razorpay({
    key_id: rzp_key_id,
    key_secret: rzp_key_secret,
});

router.post('/order', async (req, res) => {
    try {
        const { total, email, cart, firstName, lastName, address1, address2, stateCountry, postalZip, country } = req.body;

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }
        const orderCount = await Order.countDocuments();

        // Create a new order object
        const newOrder = new Order({
            order_id: orderCount + 1,
            user_id: user.user_id, // Use MongoDB _id for reference
            products: cart,
            totalAmount: total,
            shippingAddress: {
                firstName: firstName,
                lastName: lastName,
                address1: address1,
                address2: address2,
                stateCountry: stateCountry,
                postalZip: postalZip,

            },
            paymentMethod: 'Online',
        });

        // Save the new order to the database
        await newOrder.save();
        console.log('Order saved successfully:', newOrder);

        // Razorpay order creation
        const options = {
            amount: total * 100, // Convert to paise
            currency: "INR",
            receipt: newOrder._id.toString(), // Use MongoDB's _id as the receipt
        };

        // Create the Razorpay order
        const rzpOrder = await instance.orders.create(options);
        console.log('Razorpay order:', rzpOrder);

        // Update the order with Razorpay order ID
        newOrder.rzp_order_id = rzpOrder.id;
        await newOrder.save();

        // Send the response with the created order
        res.status(200).json({
            success: true,
            order: rzpOrder,
            orderId: newOrder._id,
            rzp_key_id,
        });

    } catch (error) {
        console.error('Error creating order:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
});


// My orders 

router.post('/myorder', async (req, res) => {
    try {
        console.log('In myorder');
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }
        console.log(user);
        const order=await  Order.find({user_id: user.user_id})
        res.status(200).json({ success: 'Krishna sadadekar!',orders:order });

    } catch (error) {
        console.error('Error creating order:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
});


// Verifying the payment
router.post('/verifypayment', async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        // Construct the signature
        const sign = `${razorpay_order_id}|${razorpay_payment_id}`;
        const expectedSignature = crypto
            .createHmac('sha256', rzp_key_secret)
            .update(sign)
            .digest('hex');

        console.log('Generated Signature:', expectedSignature);
        console.log('Received Signature:', razorpay_signature);

        // Verify the signature
        if (razorpay_signature === expectedSignature) {
            console.log('--Signature matches--');

            // Update the order status to paid
            const order = await Order.findOneAndUpdate(
                { rzp_order_id: razorpay_order_id }, // Use the Razorpay order ID
                { status: 'Paid' },
                { new: true }
            );

            if (!order) {
                return res.status(404).json({ message: 'Order not found' });
            }

            return res.status(200).json({ message: 'Payment verified successfully' });
        } else {
            console.log('--Signature does not match--');
            return res.status(400).json({ message: 'Invalid signature, payment verification failed' });
        }

    } catch (error) {
        console.log('--in error loop---');
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error!' });
    }
});

module.exports = router;
