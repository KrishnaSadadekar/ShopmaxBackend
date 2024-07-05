const express = require('express');
const router = express.Router();

const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtSecret = "HaHa";
// ----------------------------
const User = require('../Models/userModel');

// ----------------------------
// Validator to validate
const userValidationRules = [
    body('email')
        .isEmail()
        .withMessage('Enter valid email Id'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
];

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
    // Handle validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errormessage = errors.array().map(err => err.msg).join('; ');
        return res.status(400).json({ success: false, error: errormessage });
    }
    next();
};

router.post('/createuser', userValidationRules, handleValidationErrors, async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
         console.log('FirstName ',firstName,'email ',email);
        // Check for existing user
        
        const user = await User.findOne({email});
        console.log('User',user)
        if (user) {
            return res.status(400).json({ success: false, error: 'Email is already registered' });
        }

        // Encrypt the password
        const salt = await bcrypt.genSalt(10);
        const securePass = await bcrypt.hash(password, salt);
        const userCount = await User.countDocuments();
        const id = userCount + 1;
        
        

        // --------------------
        const newUser = new User({
            user_id:id,
            firstName,
            lastName,
            email,
            password: securePass
        });

       
        await newUser.save();
        console.log('Save data ',)
        
        // Generate the token with the payload
        const authToken = jwt.sign({ user_id: id }, jwtSecret);

        return res.json({ success: true, authToken });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
