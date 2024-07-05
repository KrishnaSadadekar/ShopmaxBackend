const express = require('express');
const router = express.Router();

const productModel = require('../Models/ProductModel')
router.get('/products', async (req, res) => {
    try {
        const products = await productModel.find();
        return res.json(products);
    } catch (error) {
        console.log(error)
        return res.json({ success: false });
    }

})




module.exports = router;